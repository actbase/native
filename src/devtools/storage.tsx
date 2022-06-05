import React, { useEffect, useState } from 'react';
import { FlatList, NativeModules, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import { handleCopy, isClipboardEnabled } from './common';

const RCTAsyncStorage =
  NativeModules.PlatformLocalStorage || // Support for external modules, like react-native-windows
  NativeModules.RNC_AsyncSQLiteDBStorage ||
  NativeModules.RNCAsyncStorage;

export const isAsyncStorage = () => {
  return !!RCTAsyncStorage;
};

export type ErrorLike = {
  message: string;
  key: string;
};

export type RowData = {
  key: string;
  value: string;
};

const AsyncStorage = () => {
  const [err, setErr] = useState<string | undefined>();
  const [data, setData] = useState<RowData[]>([]);
  const [openeds, setOpeneds] = useState<string[]>([]);

  useEffect(() => {
    RCTAsyncStorage.getAllKeys((error: ErrorLike, keys: any) => {
      if (error) {
        setErr(error.message);
        return;
      }
      RCTAsyncStorage.multiGet(keys, (errors: Error[], result: any) => {
        if (errors?.length > 0) {
          setErr(errors?.map(v => v.message).join('\n'));
          return;
        }
        setData(
          result?.reduce((a: RowData[], v: string[]) => {
            a.push({
              key: v[0],
              value: v[1],
            });
            return a;
          }, []),
        );
      });
    });
  }, []);

  return (
    <FlatList
      data={data}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <View style={styles.noItem}>
          {!err ? <Text style={styles.noItemText}>Not found Data</Text> : <Text style={styles.noItemText}>{err}</Text>}
        </View>
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Async Storage</Text>
        </View>
      }
      renderItem={({ item }) => {
        const open = openeds.includes(item.key);
        return (
          <View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                height: 35,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
              onPress={() => {
                setOpeneds(x => {
                  const draft = [...x];
                  const ix = draft.indexOf(item.key);
                  if (ix >= 0) {
                    draft.splice(ix, 1);
                  } else {
                    draft.push(item.key);
                  }
                  return draft;
                });
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#555' }}>{item.key}</Text>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderLeftWidth: 2,
                  borderBottomWidth: 2,
                  right: 3,
                  top: open ? 1 : -1,
                  transform: [{ rotateZ: open ? '135deg' : '-45deg' }],
                }}
              />
              {isClipboardEnabled && (
                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  onPress={() => handleCopy(item.value)}
                  hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
                >
                  <Text style={{ fontSize: 12 }}>📄</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            {open && (
              <View style={{ backgroundColor: '#f0f0f0', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 }}>
                <Text style={{ fontSize: 12 }}>{item.value}</Text>
              </View>
            )}
          </View>
        );
      }}
      style={{ flex: 1 }}
    />
  );
};

export default AsyncStorage;

import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import { handleCopy, isClipboardEnabled, ReduxStore, RowData } from './common';

const Redux = ({ store }: { store: ReduxStore | undefined }) => {
  const [data, setData] = useState<RowData[]>([]);
  const [openeds, setOpeneds] = useState<string[]>([]);

  useEffect(() => {
    if (!store) return;
    const v = store.getState();
    setData(
      Object.keys(v || {}).reduce((a: RowData[], key) => {
        const rowData: RowData = {
          key,
          value: JSON.stringify(v[key], null, 2),
        };
        a.push(rowData);
        return a;
      }, []),
    );
  }, [store]);

  return (
    <FlatList
      data={data}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <View style={styles.noItem}>
          <Text style={styles.noItemText}>Not found Data</Text>
        </View>
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Redux Store</Text>
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
                minHeight: 35,
                paddingVertical: 5,
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              </View>
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

export default Redux;

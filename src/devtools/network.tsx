import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { handleCopy, isClipboardEnabled, METHOD_OPTIONS, NETWORK_LOG_BACKGROUND, NetworkLogItem } from './common';
import styles from './styles';

const FIELDS: { key: string; title: string; render?: () => string }[] = [
  {
    key: 'url',
    title: 'URL',
  },
  {
    key: 'status',
    title: 'Status Code',
  },
  {
    key: 'method',
    title: 'Method',
  },
  {
    key: 'headers',
    title: 'Headers',
  },
  {
    key: 'body',
    title: 'Request Body',
  },
  {
    key: 'response',
    title: 'Response Text',
  },
];

const Network = ({ data, onClear }: { data: NetworkLogItem[]; onClear: () => void }) => {
  const [details, setDetails] = useState<any>();
  return (
    <View style={{ flex: 1 }}>
      {details && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 10, backgroundColor: '#fff', borderRadius: 20 }]}>
          <View>
            <TouchableOpacity
              onPress={() => setDetails(undefined)}
              style={{
                height: 40,
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 12 }}>Go Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {FIELDS?.map(field => {
              // eslint-disable-next-line no-nested-ternary
              const text =
                typeof details?.[field.key] === 'string'
                  ? details?.[field.key]
                  : JSON.stringify(details?.[field.key], null, 2);
              if (!text) return null;
              return (
                <View key={field.key} style={{ paddingHorizontal: 10, paddingBottom: 15 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 11,
                        color: '#333',
                        fontWeight: 'bold',
                        lineHeight: 16,
                      }}
                    >
                      {field.title}
                    </Text>
                    {isClipboardEnabled && (
                      <TouchableOpacity onPress={() => handleCopy(text)}>
                        <Text style={{ fontSize: 12 }}>📄</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => handleCopy(text)}
                    disabled={!isClipboardEnabled}
                    style={{
                      backgroundColor: '#eee',
                      borderRadius: 5,
                      padding: 10,
                      marginTop: 5,
                    }}
                  >
                    {/* @ts-ignore */}
                    <Text style={{ fontSize: 12, color: '#555' }}>{text}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
      <FlatList
        data={data}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.noItem}>
            <Text style={styles.noItemText}>Not found Network Log</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Network</Text>
            {!!data?.length && (
              <TouchableOpacity style={styles.clearButton} onPress={onClear}>
                <Text style={styles.clearButtonText}>CLEAR</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const opt = METHOD_OPTIONS[item.method];
          const date = new Date();
          if (item.time) {
            date.setTime(item.time);
          }

          const timeStr = [];
          timeStr.push(
            date
              .getHours()
              .toString()
              .padStart(2, '0'),
          );
          timeStr.push(
            date
              .getMinutes()
              .toString()
              .padStart(2, '0'),
          );
          timeStr.push(
            date
              .getSeconds()
              .toString()
              .padStart(2, '0'),
          );

          const e = String(Math.floor((item.status ?? 0) / 100));

          return (
            <TouchableOpacity
              onPress={() => {
                delete item.obj;
                setDetails(item);
              }}
              style={[
                styles.networkItem,
                {
                  backgroundColor: NETWORK_LOG_BACKGROUND?.[e] ?? '#fff',
                },
              ]}
            >
              <View
                style={[
                  styles.networkItemTag,
                  {
                    backgroundColor: opt?.background,
                  },
                ]}
              >
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#fff' }} allowFontScaling={false}>
                  {item.method}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#fff' }}>{item.status ?? '-'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#333' }}>{item.url}</Text>
                <Text
                  style={{
                    fontSize: 10,
                    lineHeight: 12,
                    marginTop: 2,
                    color: '#777',
                  }}
                >
                  {item.finish && item.time && (
                    <>
                      {(item.finish ?? 0) - (item.time ?? 0)}ms{' - '}
                    </>
                  )}
                  Call to {timeStr?.join(':')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default Network;

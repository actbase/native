import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';

const Console = ({ data, onClear }: { data: any[]; onClear: () => void }) => {
  return (
    <FlatList
      data={data}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <View style={styles.noItem}>
          <Text style={styles.noItemText}>Not found Console Log</Text>
        </View>
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Console</Text>
          {!!data?.length && (
            <TouchableOpacity style={styles.clearButton} onPress={onClear}>
              <Text style={styles.clearButtonText}>CLEAR</Text>
            </TouchableOpacity>
          )}
        </View>
      }
      renderItem={({ item }) => {
        const dt = new Date();
        dt.setTime(item.time);
        const timeStr: string[] = [];
        timeStr.push(
          dt
            .getHours()
            .toString()
            .padStart(2, '0'),
        );
        timeStr.push(
          dt
            .getMinutes()
            .toString()
            .padStart(2, '0'),
        );
        timeStr.push(
          dt
            .getSeconds()
            .toString()
            .padStart(2, '0'),
        );
        return (
          <View style={styles.consoleItem}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={styles.consoleItemTag}>
                <Text style={styles.consoleItemTagText}>{item.type?.toUpperCase()}</Text>
              </View>
              <Text style={{ fontSize: 10, color: '#555' }}>{timeStr?.join(':')}</Text>
            </View>

            <Text style={{ fontSize: 12, color: '#555', lineHeight: 16 }}>
              {typeof item.data === 'string' ? item.data : JSON.stringify(item.data, null, 2)}
            </Text>
          </View>
        );
      }}
      style={{ flex: 1 }}
    />
  );
};

export default Console;

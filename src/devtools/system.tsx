import React from 'react';
import { FlatList, Text, View } from 'react-native';

import styles from './styles';

const System = () => {
  return (
    <FlatList
      data={[]}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <View style={styles.noItem}>
          <Text style={styles.noItemText}>Require to DeviceInfo</Text>
        </View>
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>System</Text>
        </View>
      }
      renderItem={() => <View style={{}} />}
      style={{ flex: 1 }}
    />
  );
};

export default System;

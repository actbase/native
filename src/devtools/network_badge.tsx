import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NetworkLogItem } from './common';

const NetworkBadge = ({ data }: { data: NetworkLogItem[] }) => {
  const items = useMemo(() => {
    return data.slice(0, 3);
  }, [data]);

  const first = items?.[0];

  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }]}
    >
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {items.map(() => (
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#aaa',
              marginHorizontal: 1,
            }}
          />
        ))}
      </View>
      <View
        style={{
          backgroundColor: '#0f0',
          borderRadius: 2,
          paddingHorizontal: 4,
          height: 15,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 3,
        }}
      >
        <Text style={{ fontSize: 10, fontWeight: 'bold' }} allowFontScaling={false}>
          {first?.method}
        </Text>
      </View>
      <Text style={{ fontSize: 8, lineHeight: 12, height: 12 }} allowFontScaling={false}>
        {first?.state}
      </Text>
    </View>
  );
};

export default NetworkBadge;

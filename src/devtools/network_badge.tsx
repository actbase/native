import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { METHOD_OPTIONS, NetworkLogItem } from './common';

const BACKGROUND_FOR_STATE = {
  ok: '#339933',
  fail: '#db2929',
  ready: '#aaa',
};

const NetworkBadge = ({ data, show }: { data: NetworkLogItem[]; show: boolean }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const tk = useRef<unknown>(0);

  const items = useMemo(() => data.slice(0, 3), [data]);
  const first = items?.[0];

  useEffect(() => {
    if (tk.current && typeof tk.current === 'number') {
      clearTimeout(tk.current);
    }

    Animated.timing(opacity, {
      toValue: data?.length > 0 ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();

    const f = data?.[0];
    if (data?.length > 0 && f?.state !== 'ready') {
      tk.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }, 2000);
    }
  }, [`${data?.[0]?.state}-${data?.[0]?.time}`]);

  if (!show) return null;

  const methodOption = METHOD_OPTIONS[first?.method];

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { opacity, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {items.map(({ state }) =>
          !state ? (
            undefined
          ) : (
            <View
              style={{
                backgroundColor: BACKGROUND_FOR_STATE?.[state],
                width: 4,
                height: 4,
                borderRadius: 2,
                marginHorizontal: 1,
              }}
            />
          ),
        )}
      </View>
      {methodOption !== undefined && (
        <View
          style={{
            backgroundColor: methodOption.background,
            borderRadius: 2,
            paddingHorizontal: 4,
            height: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#fff' }} allowFontScaling={false}>
            {methodOption.label}
          </Text>
        </View>
      )}
      <Text style={{ fontSize: 8, lineHeight: 12, height: 12 }} allowFontScaling={false}>
        {!first?.finish ? '-' : first?.finish - (first?.time ?? 0)}
      </Text>
    </Animated.View>
  );
};

export default NetworkBadge;

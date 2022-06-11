import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';

import { NavData, ReactNavRef, RNavRouteData, RNavRouteItem } from './common';
import styles from './styles';

const parseState = (data: RNavRouteData | undefined) => {
  if (!data) return undefined;

  const o: NavData[] =
    data?.routeNames?.map(name => ({
      name,
    })) ?? [];

  // eslint-disable-next-line no-unused-expressions
  data?.routes?.forEach((item: RNavRouteItem) => {
    const ix = o.findIndex(v => v.name === item.name);
    if (ix >= 0) {
      o[ix].key = item.key;
      o[ix].items = parseState(item.state);
      o[ix].data = JSON.stringify(o[ix].items);
    }
  });
  return o;
};

const NavigationItem = ({ item }: { item: NavData }) => {
  return (
    <View>
      <TouchableOpacity style={styles.navigationItem} activeOpacity={0.8}>
        <Text style={styles.navigationText}>{item.name}</Text>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#db2929' }} />
      </TouchableOpacity>
      {!!item?.items?.length && (
        <View style={styles.navigationChild}>
          {item?.items?.map((o, index) => {
            return <NavigationItem item={o} key={String(index)} />;
          })}
        </View>
      )}
    </View>
  );
};

const Navigation = ({ navigation, opened }: { opened: boolean; navigation: ReactNavRef | undefined }) => {
  const [data, setData] = useState<NavData[]>([]);
  useEffect(() => {
    if (!navigation || !opened) return;

    const state = navigation.current?.getRootState?.();
    setData(parseState(state) ?? []);
  }, [opened]);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navigation</Text>
      </View>
      {data?.map((item, index) => {
        return <NavigationItem item={item} key={item.key ?? String(index)} />;
      })}
    </ScrollView>
  );
};

export default Navigation;

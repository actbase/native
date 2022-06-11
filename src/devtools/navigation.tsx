import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';

import { NavData, ReactNavRef, RNavRouteData, RNavRouteItem } from './common';
import styles from './styles';

const parseState = (data: RNavRouteData | undefined) => {
  if (!data?.routes || !data?.routeNames || !data?.routes?.forEach) return [];
  try {
    const o: NavData[] =
      data?.routeNames?.map(name => ({
        name,
      })) ?? [];

    data.routes.forEach((item: RNavRouteItem) => {
      const ix = o.findIndex(v => v.name === item.name);
      if (ix >= 0) {
        o[ix].key = item.key;
        o[ix].items = parseState(item.state);
        o[ix].data = JSON.stringify(o[ix].items);
      }
    });
    return o;
  } catch (e) {
    return [];
  }
};

const NavigationItem = ({
  item,
  current,
  navigate,
}: {
  item: NavData;
  current: string;
  navigate: (name: string) => void;
}) => {
  return (
    <View>
      <TouchableOpacity style={styles.navigationItem} activeOpacity={0.8} onPress={() => navigate(item.name)}>
        <Text style={styles.navigationText}>{item.name}</Text>
        {current === item.key && (
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#db2929' }} />
        )}
      </TouchableOpacity>
      {!!item?.items?.length && (
        <View style={styles.navigationChild}>
          {item?.items?.map((o, index) => {
            return <NavigationItem item={o} key={String(index)} current={current} navigate={navigate} />;
          })}
        </View>
      )}
    </View>
  );
};

const Navigation = ({
  navigation,
  opened,
  onExit,
}: {
  opened: boolean;
  navigation: ReactNavRef | undefined;
  onExit: () => void;
}) => {
  const [data, setData] = useState<NavData[]>([]);
  const [current, setCurrent] = useState('');
  useEffect(() => {
    if (!navigation?.current || !opened) return;

    const state = navigation.current?.getRootState?.();
    const { key } = navigation.current?.getCurrentRoute?.() ?? {};
    setCurrent(key ?? '');
    setData(parseState(state) ?? []);
  }, [opened]);

  const navigate = (name: string) => {
    if (!navigation?.current?.navigate) return;
    navigation.current.navigate(name);
    if (onExit) onExit();
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navigation</Text>
      </View>
      {data?.map((item, index) => {
        return <NavigationItem item={item} key={item.key ?? String(index)} current={current} navigate={navigate} />;
      })}
    </ScrollView>
  );
};

export default Navigation;

import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ReactNavRef } from './common';
import styles from './styles';

const Navigation = ({ navigation }: { navigation: ReactNavRef | undefined }) => {
  useEffect(() => {
    if (!navigation) return;

    const state = navigation.current?.getRootState?.();
    console.log(JSON.stringify(state, null, 2));
  }, []);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navigation</Text>
      </View>
    </ScrollView>
  );
};

export default Navigation;

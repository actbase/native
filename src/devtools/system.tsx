import React, { useMemo } from 'react';
import { NativeModules, Platform, SectionList, Text, View, TouchableOpacity, Switch } from 'react-native';

import styles from './styles';
import { handleCopy, isClipboardEnabled } from './common';
import { DevContext } from './index';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const constants = Platform.constants ?? {};
const { RNDeviceInfo } = NativeModules;

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

interface DataItemButton {
  title: string;
  onPress: () => void;
}

interface DataItem {
  title: string;
  value?: string;
  onPress?: () => void;
  buttons?: DataItemButton[];
}

interface SectionDataItem {
  key: string;
  title: string;
  data: DataItem[];
}

const originSections: SectionDataItem[] = [
  {
    key: 'info',
    title: 'System Info',
    data: [
      {
        title: 'Platform',
        value: Platform.OS,
      },
      {
        title: 'OS Version',
        value: Platform.Version,
      },
      constants && {
        title: 'React-Native',
        value: `${constants?.reactNativeVersion?.major}.${constants?.reactNativeVersion?.minor}.${constants?.reactNativeVersion.patch}`,
      },
      RNDeviceInfo &&
        RNDeviceInfo.brand && {
          title: 'Brand',
          value: RNDeviceInfo.brand,
        },
      RNDeviceInfo &&
        RNDeviceInfo.model && {
          title: 'Model',
          value: RNDeviceInfo.model,
        },
      RNDeviceInfo &&
        RNDeviceInfo.deviceId && {
          title: 'Device ID',
          value: RNDeviceInfo.deviceId,
        },
    ].filter(v => !!v),
  },
  {
    key: 'var',
    title: 'Variants',
    data: [],
  },
  {
    key: 'cmd',
    title: 'Command',
    data: [],
  },
];

const System = ({ variants }: { variants?: { [key: string]: unknown } }) => {
  const { options, setOptions } = React.useContext(DevContext);

  const sections = useMemo(() => {
    const o = JSON.parse(JSON.stringify(originSections));

    try {
      if (Platform.OS === 'android' && RNDeviceInfo && RNDeviceInfo.getDeviceNameSync) {
        o[0].data.push({
          title: 'Device Name',
          value: RNDeviceInfo.getDeviceNameSync(),
        });
      }
    } catch (e) {
      o[0].data.push({
        title: 'Device Name',
        value: e?.message ?? 'error',
      });
    }

    try {
      if (Platform.OS === 'android' && RNDeviceInfo && RNDeviceInfo.getMacAddressSync) {
        o[0].data.push({
          title: 'MAC Address',
          value: RNDeviceInfo.getMacAddressSync(),
        });
      }
    } catch (e) {
      o[0].data.push({
        title: 'MAC Address',
        value: e?.message ?? 'error',
      });
    }

    try {
      if (RNDeviceInfo && RNDeviceInfo.getIpAddressSync) {
        o[0].data.push({
          title: 'IP Address',
          value: RNDeviceInfo.getIpAddressSync(),
        });
      }
    } catch (e) {
      o[0].data.push({
        title: 'IP Address',
        value: e?.message ?? 'error',
      });
    }

    try {
      if (RNDeviceInfo && RNDeviceInfo.getUsedMemorySync) {
        o[0].data.push({
          title: 'Used Memory',
          value: formatBytes(RNDeviceInfo.getUsedMemorySync()),
        });
      }
    } catch (e) {
      o[0].data.push({
        title: 'Used Memory',
        value: e?.message ?? 'error',
      });
    }

    try {
      if (RNDeviceInfo && RNDeviceInfo.getTotalMemorySync) {
        o[0].data.push({
          title: 'Total Memory',
          value: formatBytes(RNDeviceInfo.getTotalMemorySync()),
        });
      }
    } catch (e) {
      o[0].data.push({
        title: 'Total Memory',
        value: e?.message ?? 'error',
      });
    }

    try {
      if (RNDeviceInfo && RNDeviceInfo.getFreeDiskStorageSync) {
        o[0].data.push({
          title: 'Free Disk Space',
          value: formatBytes(RNDeviceInfo.getFreeDiskStorageSync()),
        });
      }
    } catch (e) {
      o[0].data.push({
        title: 'Free Disk Space',
        value: e?.message ?? 'error',
      });
    }

    const keys = Object.keys(variants ?? {});
    if (keys.length === 0) {
      o.splice(1, 1);
    } else if (variants) {
      o[1].data = keys.reduce((a: DataItem[], b) => {
        a.push({
          title: b,
          value: String(variants[b]),
        });
        return a;
      }, []);
    }

    const ix = o.findIndex((x: SectionDataItem) => x.key === 'cmd');
    if (NativeModules.DevSettings && __DEV__) {
      o[ix].data.push({
        title: 'Reload',
        onPress: () => {
          NativeModules.DevSettings.reload();
        },
      });
    }

    if (NativeModules.RNExitApp) {
      o[ix].data.push({
        title: 'Exit',
        onPress: () => {
          NativeModules.RNExitApp.exitApp();
        },
      });
    }

    if (o[ix].data.length === 0) {
      o.splice(ix, 1);
    }

    return o;
  }, [variants]);

  return (
    <SectionList
      sections={sections}
      contentContainerStyle={{ flexGrow: 1 }}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>System</Text>
        </View>
      }
      ListFooterComponent={
        <View>
          <View style={styles.systemSectionHeader}>
            <View style={styles.systemSectionBadge}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>Monitor</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.systemSectionItem, styles.systemSectionItemFoot]}
            disabled={!setOptions}
            onPress={() => {
              if (!setOptions) return;
              const o = { ...options, module: { ...options.module } };
              o.module.network = !o.module?.network;
              setOptions(o);
            }}
          >
            <Text style={{ fontSize: 11, lineHeight: 16, fontWeight: 'bold', color: '#333' }}>Network</Text>
            <Switch
              value={options.module?.network}
              disabled={!setOptions}
              onValueChange={value => {
                if (!setOptions) return;
                const o = { ...options, module: { ...options.module } };
                o.module.network = value;
                setOptions(o);
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.systemSectionItem, styles.systemSectionItemFoot]}
            disabled={!setOptions}
            onPress={() => {
              if (!setOptions) return;
              const o = { ...options, module: { ...options.module } };
              o.module.console = !o.module?.console;
              setOptions(o);
            }}
          >
            <Text style={{ fontSize: 11, lineHeight: 16, fontWeight: 'bold', color: '#333' }}>Console</Text>
            <Switch
              value={options.module?.console}
              disabled={!setOptions}
              onValueChange={value => {
                if (!setOptions) return;
                const o = { ...options, module: { ...options.module } };
                o.module.console = value;
                setOptions(o);
              }}
            />
          </TouchableOpacity>
        </View>
      }
      renderSectionHeader={({ section }) => {
        return (
          <View style={styles.systemSectionHeader}>
            <View style={styles.systemSectionBadge}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>{section.title}</Text>
            </View>
          </View>
        );
      }}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity disabled={!item.onPress} onPress={item.onPress} style={styles.systemSectionItem}>
            <View style={{ width: 100 }}>
              <Text style={{ fontSize: 11, lineHeight: 16, fontWeight: 'bold', color: '#333' }}>{item.title}</Text>
            </View>
            {item.value !== undefined && (
              <>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, lineHeight: 16, color: '#555' }}>{item.value}</Text>
                </View>
                {isClipboardEnabled && item.value !== undefined && (
                  <TouchableOpacity onPress={() => handleCopy(item.value ?? '')}>
                    <Text style={{ fontSize: 12 }}>📄</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {item.buttons !== undefined && (
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                {item.buttons?.map((button: DataItemButton) => (
                  <TouchableOpacity
                    style={{
                      marginLeft: 5,
                      borderWidth: 1,
                      borderColor: '#eee',
                      borderRadius: 4,
                      paddingHorizontal: 8,
                      backgroundColor: '#eee',
                      minWidth: 50,
                      minHeight: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ lineHeight: 16, fontSize: 11 }}>{button.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </TouchableOpacity>
        );
      }}
      style={{ flex: 1 }}
    />
  );
};

System.defaultProps = {
  variants: {},
};

export default System;

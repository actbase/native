import React, { PropsWithChildren, useCallback, useState } from 'react';
import { AbsoluteProps, AbsoluteContext } from './context';
import produce from 'immer';
import { StyleProp, View, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const AbsoluteProvider: React.FC<Props> = props => {
  const [screens, setScreens] = useState<{ [key: string]: PropsWithChildren<AbsoluteProps> }>({});
  const attach = useCallback((target: string, props: PropsWithChildren<AbsoluteProps> | undefined) => {
    setScreens(
      produce(draft => {
        draft[target] = props;
      }),
    );
  }, []);

  return (
    <View style={props.style}>
      <AbsoluteContext.Provider value={{ attach }}>{props.children}</AbsoluteContext.Provider>
      {Object.keys(screens)
        .filter(v => !!screens[v])
        .map((key: string) => {
          const props = screens[key];
          return (
            <View key={`ab${key}`} style={{ position: 'absolute', left: props.left, top: props.top }}>
              {props.children}
            </View>
          );
        })}
    </View>
  );
};

export default AbsoluteProvider;

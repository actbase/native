import React, { ReactElement, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AbsoluteProvider from './absolute/provider';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const Application: React.FC<Props> = props => {
  const children: React.ReactNode[] = React.Children.toArray(props.children);
  const providerGroup: React.ReactNode = children?.find((el: any): el is React.ReactElement => {
    return el.type?.__NAME === Providers?.__NAME;
  });

  const bodies: React.ReactNode[] = children?.filter((el: any): el is React.ReactElement => {
    return el.type?.__NAME !== Providers?.__NAME;
  });

  const providers = React.Children.toArray((providerGroup as ReactElement).props.children);

  const exports: ReactNode = providers?.reduce?.((el: ReactNode, provider: ReactNode, index: number) => {
    let last: ReactElement = el as ReactElement;
    while (last.props.children?.length > 0) {
      last = last.props.children?.[0];
    }
    last.props.children.push(
      React.createElement(
        (provider as ReactElement).type,
        { key: `${index}`, ...(provider as ReactElement).props },
        [],
      ),
    );
    return el;
  }, React.createElement(React.Fragment, null, []));

  if (exports) {
    let last: ReactElement = exports as ReactElement;
    while (last.props.children?.length > 0) {
      last = last.props.children?.[0];
    }
    last.props.children.push(...bodies);
    return (
      <SafeAreaProvider>
        <AbsoluteProvider style={props.style}>{exports}</AbsoluteProvider>
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <AbsoluteProvider style={props.style}>{bodies}</AbsoluteProvider>
      </SafeAreaProvider>
    );
  }
};

const _Providers = () => <></>;
_Providers.__NAME = '__@@ABX_PROVID@@';

export const Providers = _Providers;

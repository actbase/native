import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AbsoluteProvider } from '@actbase/react-absolute';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const $Providers = () => <></>;
$Providers.$$NAME = '__@@ABX_PROVID@@';

export const Providers = $Providers;

type ElementOf = React.ReactNode & { type?: { $$NAME?: string } };

export const Application = ({ children, style }: PropsWithChildren<Props>) => {
  const oChildren: ElementOf[] = React.Children.toArray(children) as ElementOf[];
  const providerGroup: React.ReactNode = oChildren?.find((el: ElementOf) => {
    return el.type?.$$NAME === Providers?.$$NAME;
  });

  const bodies: React.ReactNode[] = oChildren?.filter((el: ElementOf) => {
    return el.type?.$$NAME !== Providers?.$$NAME;
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

  let output;
  if (exports) {
    let last: ReactElement = exports as ReactElement;
    while (last.props.children?.length > 0) {
      last = last.props.children?.[0];
    }
    last.props.children.push(...bodies);
    output = exports;
  } else {
    output = bodies;
  }

  return (
    <SafeAreaProvider>
      <View style={style}>
        <AbsoluteProvider>{output}</AbsoluteProvider>
      </View>
    </SafeAreaProvider>
  );
};

import React, { PropsWithChildren } from 'react';
import { LayoutRectangle, StyleProp, View, ViewStyle } from 'react-native';
import { DimensionContext } from './context';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const DimensionProvider = (props: PropsWithChildren<Props>) => {
  const [dimensions, setDimensions] = React.useState<LayoutRectangle | undefined>();
  return (
    <View style={props.style} onLayout={({ nativeEvent }) => setDimensions(nativeEvent?.layout)}>
      <DimensionContext.Provider value={{ dimensions }}>{props.children}</DimensionContext.Provider>
    </View>
  );
};

export default DimensionProvider;

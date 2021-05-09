import React, { PropsWithChildren } from 'react';
import { LayoutRectangle, StyleProp, View, ViewStyle } from 'react-native';
import { DimensionContext } from './Context';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const DimensionProvider = ({ style, children }: PropsWithChildren<Props>) => {
  const [dimensions, setDimensions] = React.useState<LayoutRectangle | undefined>();
  return (
    <View style={style} onLayout={({ nativeEvent }) => setDimensions(nativeEvent?.layout)}>
      <DimensionContext.Provider value={{ dimensions }}>{children}</DimensionContext.Provider>
    </View>
  );
};

export default DimensionProvider;

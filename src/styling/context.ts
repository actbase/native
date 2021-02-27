import React from 'react';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export type NamedStyles = { [key: string]: ViewStyle | TextStyle | ImageStyle };
export type DimenStyles = {
  style: {
    [key: string]: ViewStyle | TextStyle | ImageStyle;
  };
  condition?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    orientation?: 'portrait' | 'horizontal';
  };
};

export const StyleContext = React.createContext<{
  getStyle?: any;
  styles?: NamedStyles | NamedStyles[] | DimenStyles | DimenStyles[];
}>({
  styles: {},
});

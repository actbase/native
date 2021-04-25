import React from 'react';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export type NamedStyles = {
  [key: string]: (ViewStyle | TextStyle | ImageStyle) | (ViewStyle | TextStyle | ImageStyle)[];
};

export type DimenStyleItem = {
  [key: string]: (ViewStyle | TextStyle | ImageStyle)[];
};

export type DimenStyles = {
  style: DimenStyleItem;
  condition?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    orientation?: 'portrait' | 'landscape';
  };
};

export const StyleContext = React.createContext<{
  getStyle?: any;
  styles?: DimenStyles[];
}>({});

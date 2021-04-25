import * as React from 'react';
import { LayoutRectangle } from 'react-native';

export interface ContextArgs {
  dimensions?: LayoutRectangle;
}

export const DimensionContext: React.Context<ContextArgs> = React.createContext<ContextArgs>({});

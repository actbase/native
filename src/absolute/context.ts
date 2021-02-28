import * as React from 'react';
import { PropsWithChildren } from 'react';
import { LayoutRectangle } from 'react-native';

export interface AbsoluteProps {
  isVisible: boolean;
  left?: number;
  top?: number;
  onClose?: () => void;
}

export interface ContextArgs {
  styles?: any;
  attach?: (target: string, props: PropsWithChildren<AbsoluteProps> | undefined) => void;
  dimensions?: LayoutRectangle;
}

export const AbsoluteContext: React.Context<ContextArgs> = React.createContext<ContextArgs>({});

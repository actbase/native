import React from 'react';
import { View as RNView, ViewProps } from 'react-native';
import { NamedStyles } from '../styling/context';

interface TProps extends ViewProps {
  className?: string;
  conditionClassName?: {
    focus: string;
    invalid: string;
    checked: string;
  };
  // style?: string | StyleProp<ViewStyle>;
  conditionStyle?: {
    focus: NamedStyles;
    invalid: NamedStyles;
    checked: NamedStyles;
  };
}

export const View: React.FC<TProps> = props => {
  return <RNView {...props} style={{}} />;
};

export default View;

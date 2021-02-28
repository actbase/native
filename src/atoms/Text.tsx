import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { NamedStyles } from '../styling/context';

interface TProps extends TextProps {
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

export const Text: React.FC<TProps> = props => {
  return <RNText {...props} style={{}} />;
};

export default View;

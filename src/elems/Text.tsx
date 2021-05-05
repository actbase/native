import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { NamedStyles, StyleContext } from '../styling/Context';

interface TProps extends TextProps {
  className?: string;
  conditionClassName?: {
    focus: string;
    invalid: string;
    checked: string;
  };
  conditionStyle?: {
    focus: NamedStyles;
    invalid: NamedStyles;
    checked: NamedStyles;
  };
}

export const Text: React.FC<TProps> = props => {
  const styleContext = React.useContext(StyleContext);
  const style = [styleContext.getStyle(props.className), props.style];
  return <RNText {...props} style={style} />;
};

export default Text;

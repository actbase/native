import React from 'react';
import { View as RNView, ViewProps } from 'react-native';
import { NamedStyles, StyleContext } from '../styling/Context';

interface TProps extends ViewProps {
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

export const View: React.FC<TProps> = props => {
  const styleContext = React.useContext(StyleContext);
  // eslint-disable-next-line react/prop-types
  const style = [styleContext?.getStyle?.(props?.className), props.style];
  return <RNView {...props} style={style} />;
};

export default View;

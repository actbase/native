import * as React from 'react';
import { Text as RNText, TextProps } from 'react-native';

import { useStyleParse } from '../styling/RelStyleSheet';

export const Text: React.FC<TextProps> = props => {
  const style = useStyleParse(props?.style || {});
  return <RNText {...props} style={style} />;
};

Text.displayName = 'Actbase:Text';
Text.defaultProps = {};

export default Text;

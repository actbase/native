import * as React from 'react';
import { StyleProp, Text as RNText, TextProps, TextStyle, ViewPropTypes } from 'react-native';

import { useStyleParse } from '../styling/RelStyleSheet';

export const Text: React.FC<TextProps> = props => {
  const style = useStyleParse(props?.style);
  return <RNText {...props} style={style} />;
};

Text.displayName = 'Actbase:Text';
Text.propTypes = {
  style: ViewPropTypes.style,
};
Text.defaultProps = {
  style: {} as StyleProp<TextStyle>,
};

export default Text;

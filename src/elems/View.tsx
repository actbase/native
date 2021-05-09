import React from 'react';
import { View as RNView, ViewProps, ViewPropTypes } from 'react-native';

import { useStyleParse } from '../styling/RelStyleSheet';

export const View = React.forwardRef<RNView, ViewProps>((props, ref) => {
  const style = useStyleParse(props?.style || {});
  return <RNView ref={ref} {...props} style={style} />;
});

View.displayName = 'Actbase:View';
View.propTypes = ViewPropTypes;
View.defaultProps = {};

export default View;

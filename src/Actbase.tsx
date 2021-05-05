import * as React from 'react';
import View from './elems/View';

const defaults = {
  Touchable: {
    activeOpacity: 0.8,
    waitDelay: 1,
  },
};

const parseStyle = (_styles: any, props: any) => {
  // let output = undefined;
  let styles = _styles;
  if (typeof styles === 'function') {
    styles = styles(props);
    console.log(styles);
  }
  return styles;
};

const ActbaseBuilder = (Element: any) => (styles: Function | string[] | string | undefined) => (props: any) => {
  // eslint-disable-next-line no-undef
  console.log(Element, parseStyle(styles, props), props);
  return <Element {...props} />;
};

export const Actbase = {
  defaults,
  View: ActbaseBuilder(View),
};

export default Actbase;

import React from 'react';

import { NamedStyles, StyleContext } from './context';

const StyleProvider: React.FC<{ styles: NamedStyles; children: any }> = props => {
  const styleContext = React.useContext(StyleContext);
  console.log(styleContext);

  return (
    <StyleContext.Provider value={{}}>
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </StyleContext.Provider>
  );
};

export default StyleProvider;

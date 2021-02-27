import React, { useMemo } from 'react';
import { DimenStyles, NamedStyles, StyleContext } from './context';

interface Props {
  styles?: NamedStyles | NamedStyles[] | DimenStyles | DimenStyles[];
}

const StyleProvider: React.FC<Props> = props => {
  const styleContext = React.useContext(StyleContext);
  const parentStyles = styleContext?.styles || [];

  const innerStyles = useMemo<DimenStyles[]>(() => {
    const styles = !props.styles ? [] : !Array.isArray(props.styles) ? [props.styles] : props.styles;
    return styles?.map(v => {
      if (v.style === undefined) {
        return { style: v } as DimenStyles;
      }
      return v as DimenStyles;
    });
  }, [props.styles]);

  const styles = [...parentStyles, ...innerStyles];
  const getStyle = (name: string = '', prefixes: string[] = []) => {
    if (!name && typeof name !== 'string') {
      return name;
    }

    const styleNames: string[] = name.split(/(\s+)/);
    if (prefixes?.length > 0) {
      styleNames.push(
        ...prefixes?.reduce((x, y) => {
          return x.concat(
            name
              .split(' ')
              .filter((v: string) => !!v)
              .map((v: string) => v + '__' + y),
          );
        }, [] as string[]),
      );
    }

    // return styleNames.map((v) => ({
    //   ...styles[`${v}`],
    //   ..._mediaStyles[`${v}`],
    // }));
  };

  return (
    <StyleContext.Provider value={{ getStyle, styles }}>
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </StyleContext.Provider>
  );
};

export default StyleProvider;

import React, { useMemo } from 'react';
import { DimenStyles, NamedStyles, StyleContext } from './context';
import { AbsoluteContext } from '../absolute/context';
import { StyleSheet } from 'react-native';

interface Props {
  styles?: NamedStyles | NamedStyles[] | DimenStyles | DimenStyles[];
}

const StyleProvider: React.FC<Props> = props => {
  const absoluteContext = React.useContext(AbsoluteContext);
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
  const styleMap = useMemo<NamedStyles>(() => {
    const width = absoluteContext.dimensions?.width || 0;
    const height = absoluteContext.dimensions?.height || 0;
    const maps: NamedStyles = styles.reduce((x, y) => {
      if (!y.condition) {
        return { ...x, ...y.style };
      } else {
        const sMinWidth = y.condition.minWidth === undefined || y.condition.minWidth <= width;
        const sMaxWidth = y.condition.maxWidth === undefined || y.condition.maxWidth >= width;
        const sMinHeight = y.condition.minHeight === undefined || y.condition.minHeight <= height;
        const sMaxHeight = y.condition.maxHeight === undefined || y.condition.maxHeight >= height;
        if (sMinWidth && sMaxWidth && sMinHeight && sMaxHeight) {
          return { ...x, ...y.style };
        } else {
          return x;
        }
      }
    }, {});

    // styles.filter(v => {
    //   return !v.condition || v.condition.minWidth <
    // })

    return maps;
  }, [styles, absoluteContext.dimensions]);

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

    const flatten = StyleSheet.flatten(styleNames.map(v => styleMap[`${v}`]));
    return flatten;
  };

  return (
    <StyleContext.Provider value={{ getStyle, styles }}>
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </StyleContext.Provider>
  );
};

export default StyleProvider;

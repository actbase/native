import React, { useMemo } from 'react';
import { DimenStyleItem, DimenStyles, NamedStyles, StyleContext } from './context';
import { StyleSheet } from 'react-native';
import { DimensionContext } from '../dimensions/context';

interface Props {
  styles?: (NamedStyles | DimenStyles) | (NamedStyles | DimenStyles)[];
}

const StyleProvider: React.FC<Props> = props => {
  const dimensionContext = React.useContext(DimensionContext);
  const styleContext = React.useContext(StyleContext);
  const parentStyles = styleContext?.styles || [];

  const innerStyles = useMemo<DimenStyles[]>(() => {
    const styles = !props.styles ? [] : !Array.isArray(props.styles) ? [props.styles] : props.styles;
    return styles?.map(
      (v): DimenStyles => {
        if (v.style === undefined) {
          const origin = v as NamedStyles;
          const style: NamedStyles = Object.keys(origin).reduce((x: NamedStyles, y) => {
            const styleData = origin[y];
            x[y] = Array.isArray(styleData) ? styleData : [styleData];
            return x;
          }, {});
          return { style } as DimenStyles;
        } else {
          const origin = v.style as NamedStyles;
          const style: NamedStyles = Object.keys(origin).reduce((x: NamedStyles, y) => {
            const styleData = origin[y];
            x[y] = Array.isArray(styleData) ? styleData : [styleData];
            return x;
          }, {});
          return { condition: v.condition, style } as DimenStyles;
        }
      },
    );
  }, [props.styles]);

  const styles = [...parentStyles, ...innerStyles];
  const styleMap = useMemo<NamedStyles>(() => {
    const width = dimensionContext.dimensions?.width || 0;
    const height = dimensionContext.dimensions?.height || 0;
    const maps: NamedStyles = styles.reduce((x: DimenStyleItem, y) => {
      if (y.condition) {
        const sMinWidth = y.condition.minWidth === undefined || y.condition.minWidth <= width;
        const sMaxWidth = y.condition.maxWidth === undefined || y.condition.maxWidth >= width;
        const sMinHeight = y.condition.minHeight === undefined || y.condition.minHeight <= height;
        const sMaxHeight = y.condition.maxHeight === undefined || y.condition.maxHeight >= height;
        if (!(sMinWidth && sMaxWidth && sMinHeight && sMaxHeight)) {
          return x;
        }
      }

      return Object.keys(y.style).reduce((x1, y1) => {
        if (!x1[y1]) x1[y1] = [];
        x1[y1] = x1[y1].concat(y.style[y1]);
        return x1;
      }, x);
    }, {});
    return maps;
  }, [styles, dimensionContext.dimensions]);

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

  return <StyleContext.Provider value={{ getStyle, styles }}>{props.children}</StyleContext.Provider>;
};

export default StyleProvider;

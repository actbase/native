import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

type AllStyles = ViewStyle | TextStyle | ImageStyle;
export type StyleResult = AllStyles | ((props: StyleProps) => AllStyles);
export type StyleProps = {
  width: number;
  height: number;
  mode: 'dark' | 'light';
  state: 'idle' | 'hover' | 'focus' | 'invalid' | 'selected' | 'readonly' | 'disabled';
  /*
  :hover  // hover
  :active // focus
  :focus // focus
  :checked // selected
  :enabled // !disabled
  :disabled // disabled
  :read-only // readonly
  :read-write // !readonly
  :valid // !invalid
  :invalid // invalid
  */
};

type StyleObject<T> = {
  [P in keyof T]: StyleResult;
};

type ReturnAny<T> = { [P in keyof T]: unknown };

export function create<T extends StyleObject<T> & { [key: string]: AllStyles }>(styles: T): ReturnAny<T> {
  const keys = Object.keys(styles);
  const onlyStyleKeys = keys.filter((key: string) => typeof styles[key] !== 'function');
  const onlyStyles = StyleSheet.create(
    onlyStyleKeys.reduce((x: { [key: string]: AllStyles }, y) => {
      x[y] = styles[y];
      return x;
    }, {}),
  );

  return {
    ...styles,
    ...onlyStyles,
  };
}

export function useStyleParse(style: unknown): AllStyles {
  if (typeof style === 'function') {
    return {};
  }

  return style as AllStyles;
}

export const RelStyleSheet = {
  create,
  useStyleParse,
};

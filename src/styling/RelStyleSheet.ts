import { ImageStyle, TextStyle, ViewStyle, StyleSheet } from 'react-native';

type AllStyles = ViewStyle | TextStyle | ImageStyle;
type StyleProps = {
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
  [P in keyof T]: AllStyles | ((props: StyleProps) => AllStyles);
};

type ReturnAny<T> = { [P in keyof T]: any };

export function create<T extends StyleObject<T> & { [key: string]: any }>(styles: T): ReturnAny<T> {
  const keys = Object.keys(styles);
  const onlyStyleKeys = keys.filter((key: string) => typeof styles[key] !== 'function');
  const onlyStyles = StyleSheet.create(
    <{ [key: string]: AllStyles }>onlyStyleKeys.reduce((x, y) => {
      x = styles[y];
      return x;
    }, {}),
  );

  return {
    ...styles,
    ...onlyStyles,
  };
}

export const RelStyleSheet = {
  create,
};
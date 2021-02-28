import { StyleSheet } from 'react-native';

export const create = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(styles: T) => {
  const keys = Object.keys(styles).reduce((x, y) => {
    x[y] = y;
    return x;
  }, {} as { [key: string]: string });

  console.log(keys);

  return StyleSheet.create(styles);
};

export default { create };

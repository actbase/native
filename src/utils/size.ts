import * as React from 'react';
import { Dimensions, findNodeHandle, UIManager } from 'react-native';

export interface ScaledSize {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export interface MeasureOffset {
  originX: number;
  originY: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

export const getWindowSize = (): ScaledSize => {
  return Dimensions.get('screen');
};

export const measure = (
  target: null | number | React.Component<unknown, unknown> | React.ComponentClass<unknown>,
): Promise<MeasureOffset | Error> => {
  return new Promise((resolve, reject) => {
    try {
      const node = findNodeHandle(target);
      if (node === null) throw new Error();
      UIManager.measure(
        node,
        (originX: number, originY: number, width: number, oHeight: number, pageX: number, pageY: number) =>
          resolve({
            originX,
            originY,
            width,
            height: oHeight,
            pageX,
            pageY,
          }),
      );
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getWindowSize,
  measure,
};

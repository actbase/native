import React, { useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import Abase from '../Actbase';

type ALL_VALUE = any;

interface TouchableProps extends TouchableOpacityProps {
  onPress?: (e: ALL_VALUE) => Promise<ALL_VALUE> | null | undefined | void;
  onProcess?: (lock: boolean) => void;
  renderComponent: ALL_VALUE;
}

const { defaults } = Abase;

const Touchable = (props: TouchableProps) => {
  const Element = props.renderComponent || TouchableOpacity;
  const [lock, setLock] = useState(false);
  const handlePress = (e: ALL_VALUE) => {
    if (!props?.onPress) return;
    const pressed = props?.onPress?.(e);
    if (pressed instanceof Promise) {
      setLock(true);
      props?.onProcess?.(true);
      pressed.finally(() => {
        setLock(false);
        props?.onProcess?.(false);
      });
    } else {
      setLock(true);
      setTimeout(() => setLock(false), defaults.Touchable.waitDelay);
    }
  };

  return (
    <Element
      activeOpacity={defaults.Touchable.activeOpacity}
      {...props}
      onPress={handlePress}
      disabled={lock || props?.disabled}
    />
  );
};

export default Touchable;

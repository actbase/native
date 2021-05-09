import React, { useState } from 'react';
import { GestureResponderEvent, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import Abase from '../Actbase';

interface TouchableProps extends TouchableOpacityProps {
  onPress?: (e: GestureResponderEvent) => Promise<void> | null | undefined | void;
  // eslint-disable-next-line react/require-default-props
  onProcess?: (lock: boolean) => void;
  renderComponent: React.FC<TouchableOpacityProps> | React.ComponentClass<TouchableOpacityProps>;
}

const { defaults } = Abase;

const Touchable = (props: TouchableProps) => {
  const { renderComponent, onProcess } = props;
  const Element = renderComponent || TouchableOpacity;
  const [lock, setLock] = useState(false);
  const handlePress = (e: GestureResponderEvent) => {
    if (!props?.onPress) return;
    const pressed = props?.onPress?.(e);
    if (pressed instanceof Promise) {
      setLock(true);
      if (onProcess) onProcess(true);
      pressed.finally(() => {
        setLock(false);
        if (onProcess) onProcess(false);
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

Touchable.defaultProps = {
  onPress: () => undefined,
  onProcess: () => undefined,
};

export default Touchable;

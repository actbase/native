import React, { useContext, useEffect, useRef } from 'react';
import { AbsoluteProps, AbsoluteContext } from './context';
import { uniqueId } from 'lodash';

const Absolute: React.FC<AbsoluteProps> = (props) => {
  const serial = useRef(uniqueId()).current;
  const { attach } = useContext(AbsoluteContext);
  const { children, left, top, isVisible } = props;
  useEffect(() => {
    if (attach && isVisible) {
      attach(serial, { children, left, top, isVisible });
      return () => attach(serial, undefined);
    } else {
      return () => null;
    }
  }, [serial, attach, children, left, top, isVisible]);
  return null;
};

Absolute.defaultProps = {
  isVisible: true,
};

export default Absolute;

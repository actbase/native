import React, { useEffect } from 'react';
import { InputProps, RefProps, useFormField } from '../Context';

const InputHidden = (props: InputProps) => {
  const remote: RefProps | undefined = useFormField(props);
  useEffect(() => {
    remote.setValue?.(props?.value);
  }, [props?.value]);

  return <></>;
};

export default InputHidden;

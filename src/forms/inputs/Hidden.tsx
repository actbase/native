import React, { useEffect } from 'react';

import { FormRemote, InputProps, useFormField } from '../Context';

const InputHidden = (props: InputProps) => {
  const remote: FormRemote = useFormField(props);
  useEffect(() => {
    remote.setValue?.(props?.value);
  }, [props?.value]);

  return <></>;
};

export default InputHidden;

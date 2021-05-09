import * as React from 'react';

import InputHidden from './Hidden';
import InputText from './Text';

export const Hidden = InputHidden;
export const Text = InputText;

const InputDefault = () => {
  return <></>;
};

InputDefault.Text = Text;
InputDefault.Hidden = Hidden;

export default InputDefault;

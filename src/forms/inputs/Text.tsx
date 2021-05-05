import React, { useEffect, useState } from 'react';
import { InputProps, RefProps, useFormField } from '../Context';
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps, View } from 'react-native';

type InputTextProps = InputProps & TextInputProps;

const InputText = (props: InputTextProps) => {
  const onReceiveProps = (data: any) => {
    console.log('onReceiveProps', data);
  };

  const remote: RefProps | undefined = useFormField({ ...props, onReceiveProps });
  const [state, setState] = useState<'focus' | 'idle' | 'disabled'>('idle');

  useEffect(() => {
    remote.setValue?.(props?.value);
  }, [props?.value]);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setState('focus');
    props?.onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setState('idle');
    props?.onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    remote.setValue?.(text);
    props?.onChangeText?.(text);
  };

  console.log(state);

  return (
    <View>
      <TextInput {...props} onChangeText={handleChangeText} onBlur={handleBlur} onFocus={handleFocus} />
    </View>
  );
};

export default InputText;

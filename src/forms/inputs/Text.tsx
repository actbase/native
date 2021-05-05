import React, { useEffect, useState } from 'react';
import { FormItemOptions, InputProps, RefProps, useFormField } from '../Context';
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps, View } from 'react-native';

type InputTextProps = InputProps & TextInputProps;

const InputText = (props: InputTextProps) => {
  const [receiveProps, setReceiveProps] = useState<FormItemOptions>({});
  const onReceiveProps = (data: any) => {
    setReceiveProps(data);
  };

  const remote: RefProps | undefined = useFormField({ ...props, onReceiveProps });
  const [state, setState] = useState<'focus' | 'idle' | 'disabled'>(
    props.disabled || props.readonly ? 'disabled' : 'idle',
  );

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
      <TextInput
        {...props}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        onFocus={handleFocus}
        returnKeyType={props.returnKeyType || receiveProps.returnKeyType}
        onSubmitEditing={props.onSubmitEditing || receiveProps.onSubmitEditing}
      />
    </View>
  );
};

export default InputText;

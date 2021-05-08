import React, { useEffect, useRef, useState } from 'react';
import { FormItemOptions, InputProps, RefProps, useFormField } from '../Context';
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps, View } from 'react-native';
import { composeRef } from '../../utils/ref';

type InputTextProps = InputProps & TextInputProps;

const InputText = React.forwardRef<TextInput, InputTextProps>(
  (props: React.PropsWithChildren<InputTextProps>, fowarededRef) => {
    const [receiveProps, setReceiveProps] = useState<FormItemOptions>({});
    const onReceiveProps = (data: any) => {
      setReceiveProps(data);
    };

    const ref = useRef<TextInput>(null);
    const remote: RefProps | undefined = useFormField({ ...props, ref, onReceiveProps });
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

    const handleChangeText = async (text: string) => {
      props?.onChangeText?.(text);

      const value = text;
      const frmValues = remote.setValue?.(value);

      if (props.rules) {
        let rules = props.rules;
        if (!Array.isArray(rules)) {
          rules = [rules];
        }
        const promises = rules?.map((v: (t: any, fv: any) => Promise<any>) => v(value, frmValues));
        Promise.all(promises)
          .then(() => props.onError?.(undefined))
          .catch(props.onError);
      }
    };

    console.log(receiveProps, state);

    return (
      <View>
        <TextInput
          ref={composeRef(fowarededRef, ref)}
          {...props}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          onFocus={handleFocus}
          returnKeyType={props.returnKeyType || receiveProps.returnKeyType}
          onSubmitEditing={props.onSubmitEditing || receiveProps.onSubmitEditing}
        />
      </View>
    );
  },
);

export default InputText;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormRemote, InputProps, useFormField } from '../Context';
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import { composeRef } from '../../utils/ref';
import { TEXT_STYLE_NAMES } from '../../utils/styles';

type InputTextProps = InputProps & TextInputProps;

const InputText = React.forwardRef<TextInput, InputTextProps>(
  (props: React.PropsWithChildren<InputTextProps>, fowarededRef) => {
    const ref = useRef<TextInput>(null);
    const remote: FormRemote = useFormField({ ...props, ref });
    const [state, setState] = useState<'focus' | 'idle' | 'disabled'>(
      props.disabled || props.readonly ? 'disabled' : 'idle',
    );

    const { before, after, onFocus, onBlur, rules, editable, disabled, style, ...inputProps } = props;

    useEffect(() => {
      remote.setValue?.(inputProps?.value);
    }, [inputProps?.value]);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setState('focus');
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setState('idle');
      onBlur?.(e);
    };

    const handleChangeText = async (text: string) => {
      inputProps?.onChangeText?.(text);

      const value = text;
      const frmValues = remote.setValue?.(value);

      if (rules) {
        let anyRules = rules;
        if (!Array.isArray(anyRules)) {
          anyRules = [anyRules];
        }
        const promises = rules?.map((v: (t: any, fv: any) => Promise<any>) => v(value, frmValues));
        Promise.all(promises)
          .then(() => props.onError?.(undefined))
          .catch(props.onError);
      }
    };

    console.log(remote.props, state);

    const inputStyle: StyleProp<TextStyle> = useMemo(() => {
      const args: { [key: string]: any } = {
        // padding: 0,
        // paddingTop: 0,
        // paddingLeft: 0,
        // paddingStart: 0,
        // paddingRight: 0,
        // paddingBottom: 0,
        // paddingEnd: 0,
        // height: '100%',
        flex: 1,
      };
      Object.keys(style || {}).forEach(key => {
        if (style && TEXT_STYLE_NAMES.includes(key)) {
          // @ts-ignore
          args[key] = style[key];
        }
      });
      return args as StyleProp<TextStyle>;
    }, [style]);

    return (
      <View style={[style]}>
        {before}
        <TextInput
          ref={composeRef(fowarededRef, ref)}
          {...inputProps}
          style={inputStyle}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          onFocus={handleFocus}
          editable={!(!editable || disabled || remote.props?.submitting)}
          returnKeyType={inputProps.returnKeyType || remote.props?.returnKeyType}
          onSubmitEditing={inputProps.onSubmitEditing || remote.props?.onSubmitEditing}
        />
        {after}
      </View>
    );
  },
);

InputText.defaultProps = {
  editable: true,
};

export default InputText;

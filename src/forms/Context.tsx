import React, { useContext, useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent, ReturnKeyTypeOptions, TextInputSubmitEditingEventData } from 'react-native';

export interface FormItem {
  ref?: any;
  name?: string;
  onReceiveProps?: (data: FormItemOptions) => void;
  onValidate?: any;
  focus?: any;
  blur?: any;
  getValue?: () => any;
  multiable?: boolean;
  area?: number;
}

export interface FormItemOptions {
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  submitting?: boolean;
  submitted?: boolean;
}

export interface SubscribeArgs extends FormItem {
  idx?: string;
}

export interface FormContextProps {
  subscribe?: (options: SubscribeArgs) => any;
}

export interface InputProps {
  name?: string;
  rules?: ((value: any, formValues: { [key: string]: any }) => Promise<any> | any)[] | undefined;
  value?: any;
  onChangeValue?: (value: any) => void;
  onError?: (error: any | undefined) => void;
  disabled?: boolean;
  readonly?: boolean;
  before?: any;
  after?: any;
}

export interface FormRemote {
  setValue?: (value: any) => void;
  props?: any;
}

export const FormContext = React.createContext<FormContextProps>({});

export const useFormField = (options: SubscribeArgs = {}): FormRemote => {
  const ref = useRef<FormRemote>({});
  const context = useContext(FormContext);

  const [receiveProps, setReceiveProps] = useState<FormItemOptions>({});
  const onReceiveProps = (data: any) => {
    setReceiveProps(data);
  };

  useEffect(() => {
    const o = context?.subscribe?.({
      ...options,
      onReceiveProps,
      focus: () => options?.focus() || options?.ref?.focus(),
      blur: () => options?.blur() || options?.ref?.blur(),
    });
    ref.current.setValue = o.setValue;
    return o.unsubscribe;
  }, []);

  return { ...ref.current, props: receiveProps };
};

import React, { useContext, useEffect, useRef } from 'react';
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
  rules?: (() => Promise<any>)[] | (() => any)[] | undefined;
  value?: any;
  onChangeValue?: (value: any) => void;
  onError?: (value: any) => void;
  disabled?: boolean;
  readonly?: boolean;
}

export interface RefProps {
  setValue?: (value: any) => void;
}

export const FormContext = React.createContext<FormContextProps>({});

export const useFormField = (options: SubscribeArgs = {}) => {
  const ref = useRef<RefProps>({});
  const context = useContext(FormContext);

  useEffect(() => {
    const o = context?.subscribe?.({
      ...options,
      focus: options?.focus || options?.ref?.focus,
    });
    ref.current.setValue = o.setValue;
    return o.unsubscribe;
  }, []);

  return ref.current;
};

import React, { useContext, useEffect, useRef } from 'react';

export interface FormItem {
  ref?: any;
  name?: string;
  onReceiveProps?: (data: any) => void;
  onValidate?: any;
  focus?: any;
  blur?: any;
  getValue?: () => any;
  multiable?: boolean;
  area?: number;
}

export interface FormItemOptions {
  // returnKeyType?: FormItem;
  // // onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  // nextElement?: ChildOption;
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
}

export interface RefProps {
  setValue?: (value: any) => void;
}

export const FormContext = React.createContext<FormContextProps>({});

export const useFormField = (options: SubscribeArgs = {}) => {
  const ref = useRef<RefProps>({});
  const context = useContext(FormContext);

  useEffect(() => {
    const o = context?.subscribe?.(options);
    ref.current.setValue = o.setValue;
    return o.unsubscribe;
  }, []);

  return ref.current;
};

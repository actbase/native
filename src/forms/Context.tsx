import React from 'react';

export interface FormItemProps {
  name?: string;
  focus?: () => void;
  blur?: () => void;
  setProps?: (data: FormItemOptions) => void;
  getValue?: () => any;
  // onValidate?: (value: any, values: any) => ValidateResult | null;
}

export interface FormItemOptions {
  // returnKeyType?: FormItem;
  // // onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  // nextElement?: ChildOption;
  // submitting?: boolean;
  // submitted?: boolean;
  // hint?: string;
  // error?: 'success' | 'warn' | 'error';
}

export interface FormContextProps {
  subscribe?: (oRef: React.MutableRefObject<number>, node: React.ReactNode, options: FormItemProps) => void;
  unsubscribe?: (oRef: React.MutableRefObject<number>) => void;
  submit?: () => any;
}

export const FormContext = React.createContext({});

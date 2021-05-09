import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewProps } from 'react-native';

import { measure } from '../utils/size';

import { FormContext, FormItem, FormItemOptions, SubscribeArgs } from './Context';

interface FormProps extends ViewProps {
  value?: { [key: string]: unknown };
  onChangeValue?: (data: { [key: string]: unknown }) => void;
  onSubmit?: (data: { [key: string]: unknown }) => void;
  onError?: unknown;
}

const Form = (props: React.PropsWithChildren<FormProps>) => {
  const { onLayout, ...oProps } = props;

  const items = React.useRef<{ [key: string]: FormItem | undefined }>({});
  const inValue = React.useRef<{ [key: string]: unknown }>({});
  const [lastLayout, setLastLayout] = React.useState<{ width?: number; height?: number }>();
  const [lastIndex, setLastIndex] = useState(0);

  const getValues = () => {
    const output: { [key: string]: unknown } = {};
    const keys = Object.keys(items?.current)?.filter(v => !!items?.current[v]?.name);
    keys.forEach(key => {
      const option = items?.current[key];
      const name = option?.name || '';
      const multi =
        option?.multiable ||
        (option?.multiable === undefined &&
          option?.name &&
          Object.values(items?.current).filter(v => v?.name === option?.name).length > 1);
      if (multi) {
        if (!output[name]) output[name] = [];
        (output[name] as unknown[]).push(inValue.current[key]);
      } else {
        output[name] = inValue.current[key];
      }
    });
    return output;
  };

  const submit = () => {
    getValues();
  };

  const remapFields = async () => {
    await Promise.all(
      Object.keys(items.current).map(async key => {
        const el = items?.current[key];
        if (el && el?.ref?.current) {
          const pos = await measure(el.ref?.current);
          if ('pageY' in pos && 'pageX' in pos) {
            el.area = -parseFloat(`${Math.floor(pos?.pageY)}.${Math.floor(pos?.pageX)}`);
          }
        }
      }),
    );

    const elements = Object.values(items.current)
      .filter(v => !!v)
      .sort((a, b) => {
        if ((a?.area || 0) < (b?.area || 0)) return 1;
        if ((a?.area || 0) > (b?.area || 0)) return -1;
        return 0;
      });

    if (elements?.forEach) {
      elements.forEach((v: FormItem | undefined, index: number) => {
        if (!v) return;

        const args: FormItemOptions = {};
        if (elements.length - 1 <= index) {
          args.returnKeyType = 'done';
          args.onSubmitEditing = submit;
        } else {
          args.returnKeyType = 'next';
          args.onSubmitEditing = elements[index + 1]?.focus;
        }
        if (v.onReceiveProps) v.onReceiveProps(args);
      });
    }
  };

  const handleLayout = async (e: LayoutChangeEvent) => {
    if (onLayout) {
      onLayout(e);
    }
    const { width, height } = e.nativeEvent.layout;

    const pos = { width, height };
    if (lastLayout?.width === pos.width && lastLayout?.height === pos.height) return;
    setLastLayout(pos);

    await remapFields();
  };

  useEffect(() => {
    remapFields().catch(() => null);
  }, [lastIndex]);

  const unsubscribe = useCallback((idx: string) => {
    items.current[idx] = undefined;
    inValue.current[idx] = undefined;
  }, []);

  const subscribe = useCallback((ssArgs: SubscribeArgs) => {
    setLastIndex(Object.keys(items.current || {}).length);
    const ix = ssArgs?.idx || String(Object.keys(items.current || {}).length + 1);
    items.current[ix] = ssArgs;
    return {
      unsubscribe: () => unsubscribe(ix),
      setValue: (args: unknown) => {
        inValue.current[ix] = args;
        return getValues();
      },
    };
  }, []);

  const value = {
    subscribe,
    submit,
  };
  return (
    <FormContext.Provider value={value}>
      <View onLayout={handleLayout} {...oProps} />
    </FormContext.Provider>
  );
};

export default Form;

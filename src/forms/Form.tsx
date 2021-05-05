import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, Text, View, ViewProps } from 'react-native';
import { FormContext, FormItem, FormItemOptions, SubscribeArgs } from './Context';
import { measure } from '../utils/size';

interface FormProps extends ViewProps {
  value?: { [key: string]: any };
  onChangeValue?: (data: { [key: string]: any }) => void;
  onSubmit?: (data: { [key: string]: any }) => void;
  onError?: any;
}

const Form = (props: React.PropsWithChildren<FormProps>) => {
  const { onLayout, ...oProps } = props;

  const items = React.useRef<{ [key: string]: FormItem | undefined }>({});
  const [lastLayout, setLastLayout] = React.useState<{ width?: number; height?: number }>();
  const [inValue, setInValue] = useState<{ [key: string]: any }>({});
  const [lastIndex, setLastIndex] = useState(0);

  const remapFields = async () => {
    for (let key of Object.keys(items?.current)) {
      const el = items?.current[key];
      if (el && el?.ref) {
        const pos = await measure(el.ref);
        if ('pageY' in pos && 'pageX' in pos) {
          el.area = -parseFloat(`${Math.floor(pos?.pageY)}.${Math.floor(pos?.pageX)}`);
        }
      }
    }

    const elements = Object.values(items.current).sort((a, b) =>
      (a?.area || 0) < (b?.area || 0) ? 1 : (a?.area || 0) > (b?.area || 0) ? -1 : 0,
    );

    elements?.forEach((v: FormItem | undefined, index: number) => {
      if (!v) return;

      const args: FormItemOptions = {};
      if (elements.length - 1 <= index) {
        args.returnKeyType = 'done';
        args.onSubmitEditing = submit;
      } else {
        args.returnKeyType = 'next';
        args.onSubmitEditing = elements[index + 1]?.focus;
      }
      v.onReceiveProps?.(args);
    });
  };

  const handleLayout = async (e: LayoutChangeEvent) => {
    onLayout && onLayout(e);
    const { width, height } = e.nativeEvent.layout;

    const pos = { width, height };
    if (lastLayout?.width === pos.width && lastLayout?.height === pos.height) return;
    setLastLayout(pos);

    await remapFields();
  };

  useEffect(() => {
    remapFields().catch(() => null);
  }, [lastIndex]);

  const getValues = () => {
    const output: { [key: string]: any } = {};
    const keys = Object.keys(items?.current)?.filter(v => !!items?.current[v]?.name);
    for (let key of keys) {
      const option = items?.current[key];
      const name = option?.name || '';
      const multi =
        option?.multiable ||
        (option?.multiable === undefined &&
          option?.name &&
          Object.values(items?.current).filter(v => v?.name === option?.name).length > 1);
      if (multi) {
        if (!output[name]) output[name] = [];
        output[name].push(inValue[key]);
      } else {
        output[name] = inValue[key];
      }
    }
    return output;
  };

  const unsubscribe = useCallback(
    (idx: string) => {
      items.current[idx] = undefined;
      setInValue(s => ({
        ...s,
        [idx]: undefined,
      }));
    },
    [setInValue],
  );

  const subscribe = useCallback(
    (props: SubscribeArgs) => {
      setLastIndex(Object.keys(items.current || {}).length);
      const ix = props?.idx || String(Object.keys(items.current || {}).length + 1);
      items.current[ix] = props;
      return {
        unsubscribe: () => unsubscribe(ix),
        setValue: (args: any) => {
          setInValue(s => ({
            ...s,
            [ix]: args,
          }));
        },
      };
    },
    [setInValue],
  );

  const submit = () => {
    getValues();
  };

  const value = {
    subscribe,
    submit,
  };
  return (
    <FormContext.Provider value={value}>
      <Text>{JSON.stringify(inValue, null, 2)}</Text>
      <View onLayout={handleLayout} {...oProps} />
    </FormContext.Provider>
  );
};

export default Form;

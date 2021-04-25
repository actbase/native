import React, { PropsWithChildren } from 'react';
import { FormContext } from './Context';
import { LayoutChangeEvent, View, ViewProps } from 'react-native';

interface FormProps extends ViewProps {
  dataType: 'json' | 'FormData';
  onSubmit?: (data: any) => void;
}

const Form = (props: PropsWithChildren<FormProps>) => {
  const { onLayout, ...oProps } = props;

  const handleLayout = async (e: LayoutChangeEvent) => {
    onLayout && onLayout(e);
    const { width, height } = e.nativeEvent.layout;
    // @ts-ignore
    // eslint-disable-next-line no-unused-vars
    const pos = { width, height };
    // if (isEqual(lastLayout, pos)) return;
    // setLastLayout(pos);
    //
    // for (let key of Object.keys(items?.current)) {
    //   const el = items?.current[key];
    //   if (el.node) {
    //     const pos = await measure(el.node);
    //     const area = -parseFloat(`${Math.floor(pos?.pageY)}.${Math.floor(pos?.pageX)}`);
    //     items.current[key].area = area;
    //   }
    // }
    //
    // const elements = Object.values(items.current)
    //   ?.filter(v => !!v.options.focus)
    //   ?.sort((a, b) => (a.area < b.area ? 1 : a.area > b.area ? -1 : 0));
    //
    // elements?.forEach((v: any, index: number) => {
    //   const args: ExtraProps = {};
    //   if (elements.length - 1 <= index) {
    //     args.returnKeyType = 'done';
    //     // args.onSubmitEditing = submit;
    //   } else {
    //     args.returnKeyType = 'next';
    //     args.nextElement = elements[index + 1].options;
    //     // args.onSubmitEditing = elements[index + 1].options.focus;
    //   }
    //   v.options?.setProps?.(args);
    // });
  };

  const value = {};
  return (
    <FormContext.Provider value={value}>
      <View onLayout={handleLayout} {...oProps} />
    </FormContext.Provider>
  );
};

export default Form;

import React, { Fragment, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import Tools from './tools';
import { DevToolContext, DevToolHooks, DevToolOptions, ReduxStore } from './common';

const INIT_OPTIONS = {
  module: { console: true, network: true },
};

export const DevContext = React.createContext<DevToolContext>({
  options: INIT_OPTIONS,
});

export const useDevTools = (): DevToolHooks => {
  const o = React.useContext(DevContext);
  return {
    showTools: o.showTools,
  };
};

interface Props {
  debug?: boolean | { network?: boolean; console?: boolean };
  reduxStore?: ReduxStore;
}

const DevTools = ({ debug, children, reduxStore }: PropsWithChildren<Props>) => {
  const [disabled, setDisabled] = useState(!debug);
  const [options, setOptions] = useState<DevToolOptions>(INIT_OPTIONS);
  const [redux, setRedux] = useState<ReduxStore | undefined>(reduxStore);

  useEffect(() => {
    if (debug && !(typeof debug === 'boolean')) {
      setOptions(x => ({
        ...x,
        module: {
          ...x.module,
          console: debug?.console ?? x.module?.console ?? false,
          network: debug?.network ?? x.module?.network ?? false,
        },
      }));
    }

    return undefined;
  }, [debug]);

  useEffect(() => {
    setRedux(reduxStore);
  }, [reduxStore]);

  const [ToolElement, toolProps] = useMemo(() => {
    const e = disabled ? Fragment : Tools;
    return [e, !disabled ? { ...options, redux } : {}];
  }, [disabled, options]);

  return (
    <DevContext.Provider
      value={{
        showTools: () => setDisabled(false),
        options,
        setOptions,
      }}
    >
      <ToolElement {...toolProps}>{children}</ToolElement>
    </DevContext.Provider>
  );
};

export default DevTools;

import React, { Fragment, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import Tools from './tools';

interface DevToolHooks {
  showTools?: () => void;
}

export const DevContext = React.createContext<DevToolHooks>({});

interface Props {
  debug?: boolean | { network?: boolean; console?: boolean };
}

export const useDevTools = (): DevToolHooks => {
  return React.useContext(DevContext);
};

const DevTools = ({ debug, children }: PropsWithChildren<Props>) => {
  const [disabled, setDisabled] = useState(!debug);
  const [options, setOptions] = useState({});
  useEffect(() => {
    if (!debug) return undefined;
    setOptions(
      typeof debug === 'boolean'
        ? { console: true, network: true }
        : {
            console: debug?.console ?? false,
            network: debug?.network ?? false,
          },
    );
    return undefined;
  }, [debug]);

  const [ToolElement, toolProps] = useMemo(() => {
    const e = disabled ? Fragment : Tools;
    return [e, !disabled ? options : {}];
  }, [disabled, options]);

  const value = {
    showTools: () => setDisabled(false),
  };

  return (
    <DevContext.Provider value={value}>
      <ToolElement {...toolProps}>{children}</ToolElement>
    </DevContext.Provider>
  );
};

export default DevTools;

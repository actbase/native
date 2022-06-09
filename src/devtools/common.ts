import { Alert, NativeModules } from 'react-native';

export const BUBBLE_SIZE = 58;
export const MINUS_SIZE = -4;

export const READY_STATUS = {
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4,
};

export const METHOD_OPTIONS = {
  GET: {
    label: 'GET',
    background: '#61affe',
  },
  POST: {
    label: 'POST',
    background: '#49cc90',
  },
  PUT: {
    label: 'PUT',
    background: '#fca130',
  },
  DELETE: {
    label: 'DEL',
    background: '#f93e3e',
  },
};

export const NETWORK_LOG_BACKGROUND: { [key: string]: string } = {
  '4': '#ffffe4',
  '5': '#ffe4e4',
};

const nativeClipboard = NativeModules.RNCClipboard;

export const isClipboardEnabled = !!nativeClipboard;
export const handleCopy: (str: string) => void = (str: string) => {
  if (!nativeClipboard) return;
  try {
    nativeClipboard.setString(str);
    Alert.alert('Actbase', 'Copy to Data');
  } catch (e) {
    Alert.alert('Actbase', 'Copy Failure');
  }
};

export type NetworkMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type LogMethod = 'log' | 'debug' | 'trace' | 'warn';

export interface DevToolOptions {
  module?: {
    console?: boolean;
    network?: boolean;
  };
  console?: {
    targets?: LogMethod[];
  };
  redux?: ReduxStore;
  navigation?: ReactNavRef;
  variants?: {
    [key: string]: unknown;
  };
}

export interface DevToolHooks {
  showTools?: () => void;
  setNavigation?: (navRef: ReactNavRef) => void;
  setVariants?: (data: { [key: string]: unknown }) => void;
}

export interface DevToolContext extends DevToolHooks {
  options: DevToolOptions;
  setOptions?: (options: DevToolOptions) => void;
}

export interface NetworkLogItem {
  method: NetworkMethod;
  url: string;

  obj?: unknown;
  time?: number;
  finish?: number;
  status?: number;

  state?: 'ready' | 'ok' | 'fail';

  body?: string;
}

export interface ConsoleLogItem {
  type: string;
  body: string;
  time: number;
}

export interface ReduxStore {
  getState: () => { [key: string]: unknown };
}

export interface ReactNavRef {
  current: {
    dangerouslyGetState?: () => { [key: string]: unknown };
    getRootState?: () => { [key: string]: unknown };
  };
}

export type RowData = {
  key: string;
  value: string;
};

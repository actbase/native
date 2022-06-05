/* eslint-disable */
import React from 'react';

const prevData = {};
const parseLogs = (data, depth = 0) => {
  if (!data) return data;
  if (depth === 0) {
    return Object.values(data)
      .map(v => {
        if (typeof v === 'string' || typeof v === 'number') {
          return v;
        }
        return JSON.stringify(parseLogs(v, 1), null, 2);
      })
      .join(' ')
      .replace(/"\$object\$"/g, '[Object object]')
      .replace(/"\$Object\$"/g, '[Object object]')
      .replace(/"\$function\$"/g, '[Function]')
      .replace(/"\$Function\$"/g, '[Function]')
      .replace(/"\$Array\$"/g, '[Array]');
  }

  if (typeof data === 'function') return '$Function$';
  if (typeof data !== 'object') return data;

  if (depth >= 3 && Array.isArray(data)) return '$Array$';
  if (depth >= 3) return `$${typeof data}$`;

  if (Array.isArray(data)) {
    return data?.map(v => parseLogs(v, depth + 1));
  }

  return Object.keys(data)?.reduce((a, v) => {
    a[v] = parseLogs(data[v], depth + 1);
    return a;
  }, {});
};

const useConsole = (enabled, types = ['log'], setConsoleLogs) => {
  React.useEffect(() => {
    if (!enabled) return undefined;

    types.forEach(type => {
      prevData[type] = console[type];
      console[type] = function console() {
        const body = parseLogs(arguments, 0);
        setConsoleLogs(o => {
          const draft = [...o];
          if (draft.length > 100) {
            draft.splice(100, draft.length - 100);
          }
          draft.splice(0, 0, {
            type: 'log',
            body,
            time: new Date().getTime(),
          });
          return draft;
        });
        prevData[type].apply?.(this, arguments);
      };
    });

    return () => {
      types.forEach(type => {
        console[type] = prevData[type];
        prevData[type] = undefined;
      });
    };
  }, [enabled]);
};

export default useConsole;

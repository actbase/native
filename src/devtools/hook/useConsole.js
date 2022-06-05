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

const useConsole = (enabled, types = ['log']) => {
  const [consoleLogs, setConsoleLogs] = React.useState([]);

  React.useEffect(() => {
    if (!enabled) return undefined;

    types.forEach(type => {
      // eslint-disable-next-line no-console
      prevData[type] = console[type];
      // eslint-disable-next-line no-console
      console[type] = function console() {
        // eslint-disable-next-line prefer-rest-params
        const body = parseLogs(arguments, 0);
        setConsoleLogs(o => {
          const draft = [...o];
          draft.splice(0, 0, {
            type: 'log',
            body,
            time: new Date().getTime(),
          });
          return draft;
        });
        // eslint-disable-next-line no-unused-expressions,prefer-rest-params
        prevData[type].apply?.(this, arguments);
      };
    });

    return () => {
      types.forEach(type => {
        // eslint-disable-next-line no-console
        console[type] = prevData[type];
        prevData[type] = undefined;
      });
    };
  }, [enabled]);

  return [consoleLogs, () => setConsoleLogs([])];
};

export default useConsole;

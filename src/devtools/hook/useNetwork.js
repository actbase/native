/* eslint-disable */
import React from 'react';

import { READY_STATUS } from '../common';

const prevData = {
  httpOpen: undefined,
  httpSend: undefined,
};

const useNetwork = (enabled, setHttpLogs) => {
  React.useEffect(() => {
    if (!enabled) return undefined;

    prevData.httpSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function send(body) {
      if (body) {
        const that = this;
        const { _method, _url } = that;

        if (_url.endsWith('/symbolicate') && _url.startsWith('http://localhost') && _method === 'POST') return;

        setHttpLogs(o => {
          const draft = [...o];
          if (draft.length > 100) {
            draft.splice(100, draft.length - 100);
          }
          const ix = draft.findIndex(x => x.obj === that);
          if (ix < 0) {
            draft.splice(0, 0, {
              obj: that,
              url: _url,
              method: _method,
              state: 'ready',
              time: new Date().getTime(),
              body,
            });
          } else {
            draft[ix].body = body;
          }
          return draft;
        });
      }

      prevData.httpSend?.apply?.(this, arguments);
    };

    prevData.httpOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function open() {
      this.addEventListener(
        'readystatechange',
        function readystatechange() {
          const that = this;
          const { readyState, status, _method, _url, _response, _headers } = this;
          const success = status === 0 || (status >= 200 && status < 400);

          if (_url.endsWith('/symbolicate') && _url.startsWith('http://localhost') && _method === 'POST') return;

          setHttpLogs(o => {
            const draft = [...o];
            if (draft.length > 100) draft.splice(100, o.length - 100);
            const ix = draft.findIndex(x => x.obj === that);
            if (readyState === READY_STATUS.OPENED) {
              if (ix < 0) {
                draft.splice(0, 0, {
                  obj: that,
                  url: _url,
                  method: _method,
                  state: 'ready',
                  time: new Date().getTime(),
                });
              } else {
                draft[ix].state = 'ready';
                draft[ix].time = new Date().getTime();
              }
            } else if (readyState === READY_STATUS.DONE && ix >= 0) {
              draft[ix].state = success ? 'ok' : 'fail';
              draft[ix].status = status;
              draft[ix].finish = new Date().getTime();
              draft[ix].obj = undefined;
              draft[ix].response = _response;
              draft[ix].headers = _headers;
            }
            return draft;
          });
        },
        false,
      );
      prevData.httpOpen?.apply?.(this, arguments);
    };

    return () => {
      XMLHttpRequest.prototype.open = prevData.httpOpen;
      prevData.httpOpen = undefined;

      XMLHttpRequest.prototype.send = prevData.httpSend;
      prevData.httpSend = undefined;
    };
  }, [enabled]);
};

export default useNetwork;

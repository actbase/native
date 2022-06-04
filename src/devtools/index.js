import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Image,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BUBBLE_SIZE, MINUS_SIZE, READY_STATUS} from './common';
import Network from './network';
import Console from './console';
import System from './system';
import styles from './styles';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Object object]';
      seen.add(value);
    }
    return value;
  };
};

const prevData = {
  httpOpen: undefined,
  httpSend: undefined,
  consoleLog: undefined,
  consoleWarn: undefined,
  consoleDebug: undefined,
  consoleTrace: undefined,
  consoleInfo: undefined,
};

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
      .replace(/\"\$object\$\"/g, '[Object object]')
      .replace(/\"\$Object\$\"/g, '[Object object]')
      .replace(/\"\$function\$\"/g, '[Function]')
      .replace(/\"\$Function\$\"/g, '[Function]')
      .replace(/\"\$Array\$\"/g, '[Array]');
  }
  if (typeof data === 'function') return '$Function$';
  else if (typeof data !== 'object') return data;

  if (depth >= 3 && Array.isArray(data)) return '$Array$';
  else if (depth >= 3) return '$' + typeof data + '$';

  if (Array.isArray(data)) {
    return data?.map(v => parseLogs(v, depth + 1));
  }

  return Object.keys(data)?.reduce((a, v) => {
    a[v] = parseLogs(data[v], depth + 1);
    return a;
  }, {});
};

const DevTool = ({children}) => {
  const inset = useSafeAreaInsets();

  const [httpLogs, setHttpLogs] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState([]);

  useEffect(() => {
    // setHttpLogs([]);
    prevData.httpSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
      if (body) {
        const that = this;
        const {_method, _url} = that;

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
              body: body,
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
    XMLHttpRequest.prototype.open = function (XMLHttpRequest) {
      this.addEventListener(
        'readystatechange',
        function (e) {
          const that = this;
          const {readyState, status, _method, _url, _response, _headers} = that;
          const success = status === 0 || (status >= 200 && status < 400);
          prevData.consoleLog(that);

          setHttpLogs(o => {
            const draft = [...o];
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

              // delete that._response;
              // prevData.consoleLog?.(JSON.stringify(that, null, 2));
            }
            return draft;
          });
        },
        false,
      );
      prevData.httpOpen?.apply?.(this, arguments);
    };

    prevData.consoleLog = console.log;
    console.log = function () {
      setConsoleLogs(o => {
        const draft = [...o];
        draft.splice(0, 0, {
          type: 'log',
          data: parseLogs(arguments),
          time: new Date().getTime(),
        });
        return draft;
      });
      prevData.consoleLog?.apply?.(this, arguments);
    };

    prevData.consoleWarn = console.warn;
    console.warn = function () {
      setConsoleLogs(o => {
        const draft = [...o];
        draft.splice(0, 0, {
          type: 'warn',
          data: parseLogs(arguments),
          time: new Date().getTime(),
        });
        return draft;
      });
      prevData.consoleWarn?.apply?.(this, arguments);
    };

    prevData.consoleDebug = console.debug;
    console.debug = function () {
      setConsoleLogs(o => {
        const draft = [...o];
        draft.splice(0, 0, {
          type: 'debug',
          data: parseLogs(arguments),
          time: new Date().getTime(),
        });
        return draft;
      });
      prevData.consoleDebug?.apply?.(this, arguments);
    };

    prevData.consoleTrace = console.trace;
    console.trace = function () {
      setConsoleLogs(o => {
        const draft = [...o];
        draft.splice(0, 0, {
          type: 'trace',
          data: parseLogs(arguments),
          time: new Date().getTime(),
        });
        return draft;
      });
      prevData.consoleTrace?.apply?.(this, arguments);
    };

    prevData.consoleInfo = console.info;
    console.info = function () {
      setConsoleLogs(o => {
        const draft = [...o];
        draft.splice(0, 0, {
          type: 'info',
          data: parseLogs(arguments),
          time: new Date().getTime(),
        });
        return draft;
      });
      prevData.consoleInfo?.apply?.(this, arguments);
    };

    return () => {
      XMLHttpRequest.prototype.open = prevData.httpOpen;
      prevData.httpOpen = undefined;

      XMLHttpRequest.prototype.send = prevData.httpSend;
      prevData.httpSend = undefined;

      console.log = prevData.consoleLog;
      prevData.consoleLog = undefined;

      console.warn = prevData.consoleWarn;
      prevData.consoleWarn = undefined;

      console.debug = prevData.consoleDebug;
      prevData.consoleDebug = undefined;

      console.trace = prevData.consoleTrace;
      prevData.consoleTrace = undefined;

      console.info = prevData.consoleInfo;
      prevData.consoleInfo = undefined;
    };
  }, []);

  const {width, height} = useWindowDimensions();
  const [index, setIndex] = useState(-1);
  const [left, setLeft] = useState(true);
  const opened = index >= 0;

  const buffer = useRef({x: MINUS_SIZE, y: inset.top + MINUS_SIZE});
  const anim = useRef(new Animated.ValueXY({...buffer.current})).current;
  anim.addListener(value => (buffer.current = value));

  const cardAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (opened) {
      Animated.timing(cardAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [opened]);

  const handleExit = () => {
    Animated.parallel([
      Animated.spring(anim.x, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.spring(anim.y, {
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
    setIndex(-1);
  };

  const panResponder = useMemo(() => {
    const handlePress = () => {
      if (!opened) {
        anim.setOffset({x: buffer.current.x, y: buffer.current.y});
        anim.setValue({x: 0, y: 0});

        if (width > 500 && buffer.current.x > 0) {
          Animated.parallel([
            Animated.timing(anim.x, {
              toValue: 20 - buffer.current.x + (width - 420),
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(anim.y, {
              toValue: inset.top + 20 - buffer.current.y,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.timing(anim.x, {
              toValue: 20 - buffer.current.x,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(anim.y, {
              toValue: inset.top + 20 - buffer.current.y,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
        }
      }
      setIndex(0);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gesture) => {
        if (!opened) {
          anim.setOffset({x: buffer.current.x, y: buffer.current.y});
          anim.setValue({x: 0, y: 0});
        }
      },
      onPanResponderMove: opened
        ? undefined
        : Animated.event(
            [
              null,
              {
                //Step 3
                dx: anim.x,
                dy: anim.y,
              },
            ],
            {
              useNativeDriver: false,
            },
          ),
      onPanResponderRelease: (e, gesture) => {
        const {dx, dy, vx, vy, moveX, moveY, x0} = gesture;
        if ((Math.abs(dx) < 2 && Math.abs(dy) < 2) || opened) {
          handlePress();
          return;
        }

        anim.flattenOffset();
        const {x, y} = buffer.current;

        const x2 = x + width * (0.2 * vx); //x;// + (Math.abs(dx) / (vx));
        const y2 = y + y * (vy * 0.7);
        setLeft(width / 2 > x2);

        Animated.parallel([
          Animated.spring(anim.x, {
            toValue:
              width / 2 > x2 ? MINUS_SIZE : width - (BUBBLE_SIZE + MINUS_SIZE),
            useNativeDriver: false,
          }),
          Animated.spring(anim.y, {
            toValue: Math.max(
              Math.min(y2, height - BUBBLE_SIZE - inset.bottom - MINUS_SIZE),
              inset.top + MINUS_SIZE,
            ),
            useNativeDriver: false,
          }),
        ]).start();
      },
    });
  }, [opened]);

  const cardOpacity = cardAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  });

  const cardTransformY = cardAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 0],
  });

  const menuLeft = useMemo(() => {
    if (left || width < 500) {
      return 20 + BUBBLE_SIZE / 2;
    }
    return 20 + BUBBLE_SIZE / 2 + (width - 420);
  }, [left, width]);

  const cardLeft = useMemo(() => {
    if (left || width < 500) {
      return 20;
    }
    return width - 400;
  }, [left]);

  const cardRight = useMemo(() => {
    if (left && width > 500) {
      return width - 400;
    }
    return 20;
  }, [left]);

  return (
    <>
      {children}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.bubble, {transform: anim.getTranslateTransform()}]}>
        <View
          style={[
            styles.bubbleItem,
            index === 0 ? styles.bubbleItemActive : {},
          ]}>
          <Image
            source={require('./bi.jpg')}
            style={{width: 40, height: 40, borderRadius: 20, marginLeft: 1.5}}
          />
          {/*<View style={{flexDirection: 'row', marginTop: 4}}>*/}
          {/*  {Array(3)*/}
          {/*    .fill('_')*/}
          {/*    .map(x => (*/}
          {/*      <View*/}
          {/*        style={{*/}
          {/*          width: 4,*/}
          {/*          height: 4,*/}
          {/*          borderRadius: 2,*/}
          {/*          backgroundColor: '#00f',*/}
          {/*          marginHorizontal: 1,*/}
          {/*        }}*/}
          {/*      />*/}
          {/*    ))}*/}
          {/*</View>*/}
          {/*<View*/}
          {/*  style={{*/}
          {/*    backgroundColor: '#0f0',*/}
          {/*    borderRadius: 2,*/}
          {/*    paddingHorizontal: 4,*/}
          {/*    height: 15,*/}
          {/*    alignItems: 'center',*/}
          {/*    justifyContent: 'center',*/}
          {/*    marginTop: 3,*/}
          {/*  }}>*/}
          {/*  <Text*/}
          {/*    style={{fontSize: 10, fontWeight: 'bold'}}*/}
          {/*    allowFontScaling={false}>*/}
          {/*    POST*/}
          {/*  </Text>*/}
          {/*</View>*/}
          {/*<Text*/}
          {/*  style={{fontSize: 8, lineHeight: 12, height: 12}}*/}
          {/*  allowFontScaling={false}>*/}
          {/*  432*/}
          {/*</Text>*/}
        </View>
      </Animated.View>

      <Animated.View
        pointerEvents={opened ? 'auto' : 'none'}
        style={{
          left: menuLeft,
          opacity: opened ? 1 : 0,
          top: inset.top + 10,

          position: 'absolute',
          right: 0,
          height: BUBBLE_SIZE + 20,
        }}>
        <ScrollView
          horizontal
          style={{flex: 1}}
          contentContainerStyle={{
            paddingLeft: BUBBLE_SIZE / 2 + 5,
            paddingVertical: 10,
          }}>
          <View
            style={[
              styles.bubble,
              {position: 'relative', marginHorizontal: 5},
            ]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setIndex(1)}
              style={[
                styles.bubbleItem,
                index === 1 ? styles.bubbleItemActive : {},
              ]}>
              <Text
                style={{fontSize: 10, fontWeight: 'bold', color: '#555'}}
                allowFontScaling={false}>
                Network
              </Text>
              <View style={styles.bubbleDesc}>
                <View style={styles.bubbleDescItem}>
                  <Text style={styles.bubbleDescText}>{httpLogs?.length}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.bubble,
              {position: 'relative', marginHorizontal: 5},
            ]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setIndex(2)}
              style={[
                styles.bubbleItem,
                index === 2 ? styles.bubbleItemActive : {},
              ]}>
              <Text
                style={{fontSize: 10, fontWeight: 'bold', color: '#555'}}
                allowFontScaling={false}>
                Console
              </Text>
              <View style={styles.bubbleDesc}>
                <View style={styles.bubbleDescItem}>
                  <Text style={styles.bubbleDescText}>
                    {consoleLogs?.length}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.bubble,
              {position: 'relative', marginHorizontal: 5},
            ]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleExit}
              style={styles.bubbleItem}>
              <Text
                style={{fontSize: 10, fontWeight: 'bold', color: '#555'}}
                allowFontScaling={false}>
                Exit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      <Animated.View
        pointerEvents={opened ? 'auto' : 'none'}
        style={[
          styles.screen,
          {
            left: cardLeft,
            right: cardRight,
            opacity: cardOpacity,
            transform: [{translateY: cardTransformY}],
            top: inset.top + 20 + BUBBLE_SIZE + 10,
            bottom: inset.bottom + 20,
          },
        ]}>
        <View style={{flex: 1}}>
          {index === 2 ? (
            <Console data={consoleLogs} onClear={() => setConsoleLogs([])} />
          ) : index === 1 ? (
            <Network data={httpLogs} onClear={() => setHttpLogs([])} />
          ) : (
            <System />
          )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Actbase Tools</Text>
          <Text style={styles.footerUri}>https://actbase.io</Text>
        </View>
      </Animated.View>
    </>
  );
};

export default DevTool;

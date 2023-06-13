import reducer, { initState } from './reducers';
import React, { useReducer, useRef, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import useMouse from 'react-use/lib/useMouse';
import ga from 'react-ga';
import startUpSound from 'assets/sounds/windows-xp-startup.mp3';
import {
  ADD_ICON,
  ADD_APP,
  DEL_APP,
  FOCUS_APP,
  MINIMIZE_APP,
  TOGGLE_MAXIMIZE_APP,
  FOCUS_ICON,
  SELECT_ICONS,
  FOCUS_DESKTOP,
  START_SELECT,
  END_SELECT,
  POWER_OFF,
  CANCEL_POWER_OFF,
  CANCEL_LOGIN,
} from './constants/actions';
import { FOCUSING, POWER_STATE } from './constants';
import { defaultIconState, defaultAppState, appSettings } from './apps';
import Modal from './Modal';
import Footer from './Footer';
import Windows from './Windows';
import Icons from './Icons';
import Login from './Login';
import { DashedBox } from 'components';
import welcomeImage from 'assets/welcome.png';

function WinXP() {
  const [state, dispatch] = useReducer(reducer, initState);
  const ref = useRef(null);
  const mouse = useMouse(ref);
  const focusedAppId = getFocusedAppId();
  const onFocusApp = useCallback(id => {
    dispatch({ type: FOCUS_APP, payload: id });
  }, []);
  const onMaximizeWindow = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: TOGGLE_MAXIMIZE_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  const onMinimizeWindow = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: MINIMIZE_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  const onCloseApp = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: DEL_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  function onMouseDownFooterApp(id) {
    if (focusedAppId === id) {
      dispatch({ type: MINIMIZE_APP, payload: id });
    } else {
      dispatch({ type: FOCUS_APP, payload: id });
    }
  }
  function onMouseDownIcon(id) {
    dispatch({ type: FOCUS_ICON, payload: id });
  }
  function onDoubleClickIcon(component) {
    const appSetting = Object.values(appSettings).find(
      setting => setting.component === component,
    );
    if (appSetting.component.name === 'SmartChild') {
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        dispatch({ type: ADD_APP, payload: appSettings.SignIn });
        /*dispatch({
          type: ADD_APP,
          payload: appSettings.SmartChild,
        });*/
      } else
        dispatch({
          type: ADD_APP,
          payload: {
            ...appSettings.Error,
            injectProps: {
              message:
                'Your browser is not Chrome. Please use Chrome browser to start SmartcHild',
            },
          },
        });
    } else dispatch({ type: ADD_APP, payload: appSetting });
    console.log('doubleclick', state);
  }
  function getFocusedAppId() {
    if (state.focusing !== FOCUSING.WINDOW) return -1;
    const focusedApp = [...state.apps]
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(app => !app.minimized);
    return focusedApp ? focusedApp.id : -1;
  }
  function onMouseDownFooter() {
    dispatch({ type: FOCUS_DESKTOP });
  }
  function onClickMenuItem(o) {
    if (o === 'Internet')
      dispatch({ type: ADD_APP, payload: appSettings['Internet Explorer'] });
    else if (o === 'Minesweeper')
      dispatch({ type: ADD_APP, payload: appSettings.Minesweeper });
    else if (o === 'My Computer')
      dispatch({ type: ADD_APP, payload: appSettings['My Computer'] });
    else if (o === 'Notepad')
      dispatch({ type: ADD_APP, payload: appSettings.Notepad });
    else if (o === 'Winamp')
      dispatch({ type: ADD_APP, payload: appSettings.Winamp });
    else if (o === 'Paint')
      dispatch({ type: ADD_APP, payload: appSettings.Paint });
    else if (o === 'Log Off')
      dispatch({ type: POWER_OFF, payload: POWER_STATE.LOG_OFF });
    else if (o === 'Turn Off Computer')
      dispatch({ type: POWER_OFF, payload: POWER_STATE.TURN_OFF });
    else
      dispatch({
        type: ADD_APP,
        payload: {
          ...appSettings.Error,
          injectProps: { message: 'C:\\\nApplication not found' },
        },
      });
  }
  function onMouseDownDesktop(e) {
    if (e.target === e.currentTarget)
      dispatch({
        type: START_SELECT,
        payload: { x: mouse.docX, y: mouse.docY },
      });
  }
  function onMouseUpDesktop(e) {
    dispatch({ type: END_SELECT });
  }
  const onIconsSelected = useCallback(
    iconIds => {
      dispatch({ type: SELECT_ICONS, payload: iconIds });
    },
    [dispatch],
  );
  function onClickModalButton(text) {
    dispatch({ type: CANCEL_POWER_OFF });
    dispatch({
      type: ADD_APP,
      payload: appSettings.Error,
    });
  }
  function onModalClose() {
    dispatch({ type: CANCEL_POWER_OFF });
  }

  function onStart() {
    const userAgent = navigator.userAgent;

    if (state.powerState === POWER_STATE.WELCOME) {
      try {
        new Audio(startUpSound).play();
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: CANCEL_POWER_OFF });
      dispatch({ type: ADD_ICON });
      if (userAgent.indexOf('Chrome') > -1) {
        setTimeout(() => {
          dispatch({
            type: ADD_APP,
            payload: appSettings.SignIn,
          });
        }, 1500);
      } else
        setTimeout(() => {
          dispatch({
            type: ADD_APP,
            payload: {
              ...appSettings.Error,
              injectProps: {
                message:
                  'Your browser is not Chrome. Please use Chrome browser to start SmartcHild',
              },
            },
          });
        }, 1500);

      // dispatch({
      //   type: ADD_APP,
      //   payload: appSettings.SmartChild,
      // });
    }
  }
  function onLogin() {
    dispatch({ type: CANCEL_LOGIN });
  }
  function onSignIn() {
    dispatch({ type: DEL_APP, payload: focusedAppId });
    dispatch({
      type: ADD_APP,
      payload: appSettings.SmartChild,
    });
  }
  return (
    <Container
      ref={ref}
      onMouseUp={onMouseUpDesktop}
      onMouseDown={onMouseDownDesktop}
      state={state.powerState}
      onAnimationEnd={onStart}
    >
      <Icons
        icons={state.icons}
        onMouseDown={onMouseDownIcon}
        onDoubleClick={onDoubleClickIcon}
        displayFocus={state.focusing === FOCUSING.ICON}
        appSettings={appSettings}
        mouse={mouse}
        selecting={state.selecting}
        setSelectedIcons={onIconsSelected}
      />
      <DashedBox startPos={state.selecting} mouse={mouse} />
      <Windows
        apps={state.apps}
        onMouseDown={onFocusApp}
        onClose={onCloseApp}
        onMinimize={onMinimizeWindow}
        onMaximize={onMaximizeWindow}
        focusedAppId={focusedAppId}
        onSignIn={onSignIn}
      />
      {state.powerState === POWER_STATE.USER && <Login login={onLogin} />}
      {state.powerState !== POWER_STATE.WELCOME &&
        state.powerState !== POWER_STATE.USER && (
          <Footer
            apps={state.apps}
            onMouseDownApp={onMouseDownFooterApp}
            focusedAppId={focusedAppId}
            onMouseDown={onMouseDownFooter}
            onClickMenuItem={onClickMenuItem}
          />
        )}
      {(state.powerState === POWER_STATE.LOG_OFF ||
        state.powerState === POWER_STATE.TURN_OFF) && (
        <Modal
          onClose={onModalClose}
          onClickButton={onClickModalButton}
          mode={state.powerState}
        />
      )}
    </Container>
  );
}

const powerOffAnimation = keyframes`
  0% {
    filter: brightness(1) grayscale(0);
    
  }
  30% {
    filter: brightness(1) grayscale(0);
  }
  100% {
    filter: brightness(0.6) grayscale(1);
  }
`;
const welcomeAnimation = keyframes`
0% {
  background: url(${welcomeImage}) no-repeat center center fixed;
  background-size: cover;
}
99% {
  background: url(${welcomeImage}) no-repeat center center fixed;
  background-size: cover;
}
100% {
  background: url(https://i.imgur.com/Zk6TR5k.jpg) no-repeat center center fixed;
  background-size: cover;
}
`;
const animation = {
  [POWER_STATE.START]: '',
  [POWER_STATE.TURN_OFF]: powerOffAnimation,
  [POWER_STATE.LOG_OFF]: powerOffAnimation,
  [POWER_STATE.WELCOME]: welcomeAnimation,
};

const Container = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans');
  font-family: Tahoma, 'Noto Sans', sans-serif;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: ${({ state }) =>
      state.powerState === POWER_STATE.TURN_OFF
        ? `url(${welcomeImage})`
        : `url(https://i.imgur.com/Zk6TR5k.jpg)`}
    no-repeat center center fixed;
  background-size: cover;
  animation: ${({ state }) => animation[state]} 5s forwards;
  *:not(input):not(textarea) {
    user-select: none;
  }
`;

export default WinXP;

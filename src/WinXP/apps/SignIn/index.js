import React, { useReducer } from 'react';
import signInImage from 'assets/login.png';
import { ADD_APP, DEL_APP } from '../../constants/actions';
import { appSettings } from '../../apps';
import { useDispatch } from 'react-redux';
// add child div to capture mouse event when not focused
// import store from '../../../store';

function SignIn({ onSignIn, isFocus }) {
  const dispatch = useDispatch();
  function onClickSignIn() {
    //console.log('here', onSignIn);
    onSignIn();
    //dispatch({ type: DEL_APP, payload: appSettings.SignIn });
    dispatch({
      type: ADD_APP,
      payload: appSettings.Paint,
    });
  }

  return (
    <div className="w-full h-full relative bg-[#ece9d8] p-4">
      <div
        className="absolute left-[205px] top-[390px] bg-transparent w-[54px] h-12 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0 "
        onClick={onClickSignIn}
      ></div>
      <img src={signInImage} alt="signInImage" className="w-full h-full" />

      {!isFocus && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      )}
    </div>
  );
}

export default SignIn;

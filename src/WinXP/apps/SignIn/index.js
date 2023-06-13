import React, { useEffect, useState } from 'react';
import signInImage from 'assets/login.png';
import loading from 'assets/login/loading.png';
// add child div to capture mouse event when not focused
// import store from '../../../store';

function SignIn({ onSignIn, isFocus }) {
  const [loadingState, setLoadingState] = useState(0);
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  useEffect(() => {
    const loadingStart = async () => {
      await delay(1000);
      setLoadingState(1);
      await delay(1000);
      setLoadingState(2);
      await delay(1000);
      setLoadingState(3);
      await delay(1000);
      onSignIn();
    };
    loadingStart();
  }, []);

  return (
    <div className="w-full h-full relative bg-[#ece9d8] p-4">
      {loadingState === 0 ? (
        <img src={signInImage} alt="signInImage" className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <img src={loading} alt="loading1" className="w-full" />
          <div className="mt-6 border-t-[1px] border-[#636363] w-full"></div>
          <div className="mt-8 flex w-full justify-center text-center text-[16px]">
            {loadingState === 1 && (
              <p>
                TrollThing <br /> 1.Connecting ...
              </p>
            )}
            {loadingState === 2 && (
              <p>
                TrollThing <br /> 2.Verifying name and password ...
              </p>
            )}
            {loadingState === 3 && (
              <p>
                TrollThing <br /> 3.Starting services ...
              </p>
            )}
          </div>
          <div className="error__button mt-4">
            <span className="error__confirm">Cancel</span>
          </div>
        </div>
      )}
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

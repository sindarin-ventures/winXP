/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

import clippy from 'assets/clippy.png';

function Clippy({ startAfter = 1000, duration = 99999999999999 }) {
  const [show, setShow] = useState(true);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const openTimer = setTimeout(() => setStart(true), startAfter);
    return () => {
      clearTimeout(openTimer);
    };
  }, [startAfter, duration]);

  
  return (
    start && (
      <Div show={show}>
        <div className="balloon__container">
          <button onClick={() => setShow(false)} className="balloon__close" />
          <span className="balloon__header__text">Welcome back!</span>
          <div className="flex flex-col">
            {
              navigator.userAgent.indexOf('Chrome') > -1 ?
              <p className="balloon__text__first">It's been a while!</p> :
              <p className="balloon__text__first">This experience requires Google Chrome on desktop!</p>
            }
                        {
              navigator.userAgent.indexOf('Chrome') > -1 ?
              <p className="balloon__text__second">Click here to get started.</p> :
              <p className="balloon__text__first">See you there!</p>
            }
            
          </div>

          <img
            className="w-[80px] h-[80px] absolute z-10 mt-6 -left-[30px] top-[35px] opacity-100"
            src={clippy}
            alt="risk"
          />
        </div>
      </Div>
    )
  );
}
const fadein = keyframes`
  0% { 
    display: block;
    opacity: 0;
  }
  100% {
    display: block;
    opacity: 1;
  }
`;
const fadeout = keyframes`
  0% { 
    display: block;
    opacity: 1;
  }
  99% {
    display: block;
    opacity: 0;
  }
  100% {
    display: none;
    opacity: 0;
  }
`;
const Div = styled.div`
  position: absolute;
  display: block;
  opacity: 0;
  animation: ${({ show }) => (show ? fadein : fadeout)} 1s forwards;
  filter: drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.4));
  .balloon__container {
    position: absolute;
    right: -4px;
    bottom: 19px;
    border: 1px solid black;
    border-radius: 7px;
    padding: 6px 28px 10px 10px;
    background-color: #ffffe1;
    font-size: 11px;
    white-space: nowrap;
    &:before {
      content: '';
      position: absolute;
      display: block;
      bottom: -19px;
      right: 15px;
      width: 0;
      height: 0;
    }
    &:after {
      content: '';
      position: absolute;
      display: block;
      bottom: -17px;
      right: 15px;
      width: 0;
      height: 0;
    }
  }
  .balloon__close:hover {
    background-color: #ffa90c;
    border-color: white;
    box-shadow: 1px 1px rgba(0, 0, 0, 0.1);
    &:before,
    &:after {
      background-color: white;
    }
  }
  .balloon__close {
    outline: none;
    position: absolute;
    right: 4px;
    top: 4px;
    width: 14px;
    height: 14px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    background-color: transparent;
    &:before {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      transform: rotate(45deg);
      height: 8px;
      width: 2px;
      background-color: rgba(170, 170, 170);
    }
    &:after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      transform: rotate(-45deg);
      height: 8px;
      width: 2px;
      background-color: rgba(170, 170, 170);
    }
  }
  .balloon__header {
    display: flex;
    align-items: center;
    font-weight: 700;
  }
  .balloon__text__first {
    margin: 5px 0 4px;
  }
`;
export default Clippy;

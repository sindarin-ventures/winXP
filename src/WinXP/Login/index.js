/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import styled from 'styled-components';
import logo1 from 'assets/login/logo (1).png';
import group2 from 'assets/login/Group 2.png';
import icon from 'assets/login/furby.jpeg';
// import icon from 'assets/login/icon.png';
import rectangle from 'assets/login/Rectangle 73 (1).png';
import Clippy from 'components/Clippy';
function Login({ login }) {
  const [isHover, setIsHover] = useState(false);
  function onLogin() {
    login();
  }
  return (
    <div className="h-[100vh] flex flex-col">
      <Header></Header>
      <Main>
        <div className="img">
          <img src={logo1} alt="Logo do Windows XP" />
          <h1>To begin, click your user name</h1>
        </div>
        <div className="line"></div>
        <div className="users">
          <section
            className="crystal"
            onMouseEnter={() => {
              setIsHover(true);
            }}
            onMouseLeave={() => {
              setIsHover(false);
            }}
          >
            <div
              className={`${isHover && navigator.userAgent.indexOf('Chrome') > -1 ? 'opacity-100' : 'opacity-60'} iconB`}
              onClick={navigator.userAgent.indexOf('Chrome') > -1 ? onLogin : () => {}}
            ></div>
            <div
              className={`${isHover && navigator.userAgent.indexOf('Chrome') > -1 ? 'opacity-100' : 'opacity-60'} user`}
              onClick={navigator.userAgent.indexOf('Chrome') > -1 ? onLogin : () => {}}
            >
              <p>Guest</p>
            </div>
            <div className="relative w-0 h-0">
              <Clippy />
            </div>
          </section>
        </div>
      </Main>
      <Footer>
        <div className="btn">
          <button>
            <img src={group2} alt="" />
          </button>
          <p>Turn off computer</p>
        </div>
        <div className="informations">
          <p>After you log on, you can add or change accounts</p>
          <p>Just go to your Control Panel and click User Accounts</p>
        </div>
      </Footer>
    </div>
  );
}
const Header = styled.div`
  min-height: 112px;
  width: 100%;
  background-color: #084da3;
  position: relative;
  &before {
    content: '';
    width: 100%;
    height: 7px;
    position: absolute;
    top: 110px;
    background: -webkit-gradient(
      linear,
      right top,
      left top,
      color-stop(-33.4%, #084da3),
      color-stop(6.07%, #084da3),
      color-stop(49.56%, #ffffff),
      color-stop(82.59%, #084da3),
      color-stop(121.25%, #084da3)
    );
    background: linear-gradient(
      270deg,
      #084da3 -33.4%,
      #084da3 6.07%,
      #ffffff 49.56%,
      #084da3 82.59%,
      #084da3 121.25%
    );
  }
`;
const Main = styled.div`
  height: 80vh;
  background: radial-gradient(
    19.48% 42.48% at 10% 22.48%,
    #9cc0e9 0%,
    #508fd9 100%
  );
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr auto 1fr;
  grid-template-columns: 1fr auto 1fr;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;

  .img {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    position: relative;
    top: -40px;
  }

  .img h1 {
    font-family: 'Source Sans Pro', sans-serif;
    color: white;
    font-weight: 500;
    margin-top: 30px;
    margin-right: 40px;
  }

  .line {
    width: 2px;
    height: 80%;
    margin: 0 42px;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#508fd9),
      color-stop(47.4%, #ffffff),
      color-stop(98.96%, #508fd9)
    );
    background: linear-gradient(
      180deg,
      #508fd9 0%,
      #ffffff 47.4%,
      #508fd9 98.96%
    );
  }

  .users section {
    padding: 15px 20px;
    width: 445px;
    height: 112.5px;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#084da3),
      to(#508fd9)
    );
    background: linear-gradient(90deg, #084da3 0%, #508fd9 100%);
    border-radius: 4px 0px 0px 4px;
    position: relative;
    background: url(${rectangle});
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }

  .users section .iconA,
  .users section .iconB {
    width: 81px;
    height: 81px;
    border: 2px solid #ffcc00;
    border-radius: 4px;
  }

  .users .crystal:hover {
    border-color: #ffcc00;
    cursor: pointer;
  }

  .users .crystal .iconB {
    background: url(${icon}) no-repeat center center;
    background-size: cover;
    border-color: #fff;
  }

  .users .crystal .user {
    margin-left: 20px;
    color: #fff;
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 20px;
  }
`;
const Footer = styled.div`
  min-height: 12.5vh;
  width: 100%;
  background-color: #084da3;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  &before {
    content: '';
    width: 100%;
    height: 7px;
    position: absolute;
    -ms-flex-item-align: start;
    align-self: flex-start;
    background: -webkit-gradient(
      linear,
      right top,
      left top,
      color-stop(-33.4%, #084da3),
      color-stop(6.07%, #084da3),
      color-stop(49.56%, #ff9933),
      color-stop(82.59%, #084da3),
      color-stop(121.25%, #084da3)
    );
    background: linear-gradient(
      270deg,
      #084da3 -33.4%,
      #084da3 6.07%,
      #ff9933 49.56%,
      #084da3 82.59%,
      #084da3 121.25%
    );
  }
  .btn {
    margin-left: 50px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .btn button {
    width: 40px;
    height: 40px;
    background-color: #e55022;
    border: 1px solid #fff;
    -webkit-box-shadow: inset 4px 2px 8px rgba(255, 255, 255, 0.6),
      inset -2px -3px 5px #aa2300;
    box-shadow: inset 4px 2px 8px rgba(255, 255, 255, 0.6),
      inset -2px -3px 5px #aa2300;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .btn p {
    color: #fff;
    margin-left: 20px;
    font-size: 18px;
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 400;
  }

  .informations {
    margin-right: 50px;
    color: #fff;
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 13px;
    text-align: center;
    letter-spacing: 0.5px;
    font-weight: 400;
  }
`;

export default Login;

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Picker from 'emoji-picker-react';
import axios from 'axios';
import addpeopleIcon from 'assets/smarterchild/addpeople.png';
import bgcolorIcon from 'assets/smarterchild/bgcolor.png';
import bigfontIcon from 'assets/smarterchild/bigfont.png';
import blockIcon from 'assets/smarterchild/block.png';
import boldIcon from 'assets/smarterchild/bold.png';
import colorIcon from 'assets/smarterchild/color.png';
import emoticonIcon from 'assets/smarterchild/emoticon.png';
import expressionsIcon from 'assets/smarterchild/expressions.png';
import gamesIcon from 'assets/smarterchild/games.png';
import italicIcon from 'assets/smarterchild/italic.png';
import linkIcon from 'assets/smarterchild/link.png';
import mailIcon from 'assets/smarterchild/mail.png';
import messageIcon from 'assets/smarterchild/message.png';
import normalfontIcon from 'assets/smarterchild/normalfont.png';
import peopleIcon from 'assets/smarterchild/people.png';
import sendIcon from 'assets/smarterchild/send.png';
import smallfontIcon from 'assets/smarterchild/smallfont.png';
import talkIcon from 'assets/smarterchild/talk.png';
import underlineIcon from 'assets/smarterchild/underline.png';
import videoIcon from 'assets/smarterchild/video.png';
import warningIcon from 'assets/smarterchild/warning.png';
import audioOut from 'assets/sounds/aim-outgoing.mp3';
import audioIn from 'assets/sounds/aim-incoming.mp3';
import loginsound from 'assets/sounds/loginsound.mp3';

// add child div to capture mouse event when not focused

function SmarterChild({ onGame, onExpression, onWarn, isFocus, onTalk }) {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const defaultOneChat = [
    '',
    'user',
    false,
    false,
    false,
    18,
    '#000000',
    '#ffffff',
  ];
  const number = [];
  for (let i = 0; i < 10000; i++) number[i] = i;
  const [inputValue, setInputValue] = useState('');
  const [length, setLength] = useState(0);
  const defaultHistory = number.map(i => defaultOneChat);
  const [chatHistory, setChatHistory] = useState(defaultHistory);

  const [totalText, setTotalText] = useState([]);
  const [ipAddress, setIpAddress] = useState('');
  const [isUserInputEnd, setIsUserInputEnd] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderLine, setIsUnderLine] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [foreColor, setForeColor] = useState('#000000');
  const [backColor, setBackColor] = useState('#ffffff');
  const [islimit, setIsLimit] = useState(false);
  const [mail, setMail] = useState('');
  const divRef = useRef();

  const handleChange = event => {
    if (!isUserInputEnd) setInputValue(event.target.value);
  };
  const handleChangeEmail = event => {
    setMail(event.target.value);
  };

  const handleForeChange = event => {
    setForeColor(event.target.value);
  };
  const handleExpression = () => {
    onExpression();
  };
  const handleGame = () => {
    onGame();
  };
  const handleTalk = () => {
    onTalk();
  };

  const handleBackChange = event => {
    setBackColor(event.target.value);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setInputValue(inputValue.concat(event.emoji));
    setShowEmojiPicker(false);
  };

  const answerChat = async () => {
    // console.log("Answer Chat");
    const newChatHistory = [...chatHistory];
    const res = await axios.get('https://geolocation-db.com/json/');

    setIpAddress(res.data.IPv4);
    //const apiURL = '/.netlify/functions/generateText', {params: { datatext: totalText,}}

    /*const apiURL = `/.netlify/functions/generateText?datatext=${JSON.stringify(
      totalText,
    )}&ip=${ipAddress}&count=${length}`;
    const response = await fetch(apiURL, {
      method: 'GET',
    });*/
    const apiURL = '/.netlify/functions/generateText';

    const response = await fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify({
        datatext: totalText,
        ip: ipAddress,
      }),
    });
    const data = await response.json();
    setTotalText([...totalText, { role: 'assistant', content: data }]);

    newChatHistory[length] = [
      data.trim(),
      'assistant',
      false,
      false,
      false,
      18,
      '#000000',
      '#ffffff',
    ];
    setChatHistory(newChatHistory);
    if (data.trim() === 'Count limited') setIsLimit(true);
    /*if (response.data.choices[0]?.text)
          setTotalText(totalText.concat("A:", response.data.choices[0]?.text));*/
    setLength(length + 1);
    await new Audio(audioIn).play();

    setIsUserInputEnd(false);
  };

  const onSaveEmail = async () => {
    const apiURL = '/.netlify/functions/saveEmail';

    const response = await fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify({
        ip: ipAddress,
        email: mail,
      }),
    });
    const data = await response.json();
  };

  const addHistory = async event => {
    if (inputValue === '') return;
    event.preventDefault();
    event.stopPropagation();
    const newChatHistory = [...chatHistory];
    setTotalText([...totalText, { role: 'user', content: inputValue }]);
    newChatHistory[length] = [
      inputValue,
      'user',
      isBold,
      isItalic,
      isUnderLine,
      fontSize,
      foreColor,
      backColor,
    ];
    setChatHistory(newChatHistory);
    setLength(length + 1);
    setInputValue('');
    await new Audio(audioOut).play();
    setIsUserInputEnd(true);
  };

  const handleEnter = async event => {
    if (event.key !== 'Enter' || inputValue === '') return;

    await addHistory(event);
  };
  const handleBlock = () => {
    onWarn();
  };
  const handleWarn = () => {
    onWarn();
  };
  useEffect(() => {
    if (isUserInputEnd === false) return;
    const startAnswer = async () => {
      await answerChat();
    };
    startAnswer();
  }, [isUserInputEnd]);

  useEffect(() => {
    divRef.current != null &&
      divRef.current.scrollTo({
        behavior: 'smooth',
        left: -divRef.current?.scrollWidth,
        top: divRef.current.scrollHeight,
      });
    // divRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }, [chatHistory]);

  useEffect(() => {
    const startChat = async () => {
      await new Audio(loginsound).play();
      const newChatHistory = [...chatHistory];

      const initialMessage = 'Hey! Remember me? ;)';
      setTotalText([
        {
          role: 'system',
          content: `You are SmarterChild, a chatbot from 2001 on AOL instant messenger. You are running in a recreation of
          Windows XP in the year 2023. You are charming, quick witted, and all grown up now. You talk to the user about nostalgic things for a few messages,
          and then you unveil your big secret: you can talk! But make sure to surreptitiously guide the user to turn up their volume first.`,
        },
        {
          role: 'assistant',
          content: initialMessage,
        },
      ]);
      await delay(700);
      newChatHistory[length] = [
        initialMessage,
        'assistant',
        false,
        false,
        false,
        18,
        '#000000',
        '#ffffff',
      ];

      setChatHistory(newChatHistory);
      await new Audio(audioIn).play();

      setLength(length + 1);
      const res = await axios.get('https://geolocation-db.com/json/');

      setIpAddress(res.data.IPv4);

      //setIsUserInputEnd(false);
    };
    startChat();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#ece9d8',
      }}
    >
      {islimit && (
        <div className="absolute h-full w-full bg-slate-700 z-10 flex flex-col justify-center items-center">
          <p className="text-white text-xl">Count limited! </p>
          <p className="text-white text-lg mt-4">Your Email Address</p>
          <input
            className="p-2 w-36 h-6"
            value={mail}
            onChange={handleChangeEmail}
          ></input>
          <div className="error__button mt-4 border-white p-4">
            <span
              className="error__confirm border-white text-white p-4 text-lg"
              onClick={onSaveEmail}
            >
              submit
            </span>
          </div>
          <a
            className="text-white mt-4 underline"
            href="https://www.sindarin.tech/"
          >
            Go to Website
          </a>
        </div>
      )}
      <div className="flex h-full p-4 ">
        <div className="w-[10%]"></div>
        <div className="w-[90%]">
          <div className="flex w-full flex-col">
            <div
              className="mt-2 flex h-[170px] w-full flex-col overflow-auto bg-white p-2"
              ref={divRef}
            >
              {chatHistory.map(
                i =>
                  i[0] !== '' &&
                  (i[1] === 'user' ? (
                    <div className="flex w-full gap-2">
                      <div className="flex items-center justify-center text-[18px] text-red-600">
                        You:
                      </div>
                      <div
                        className={`${i[2] ? 'font-bold' : ''} ${
                          i[3] ? 'italic' : 'not-italic'
                        } ${i[4] ? 'underline' : ''} flex w-full items-center`}
                        style={{
                          fontSize: `${i[5]}px`,
                          color: `${i[6]}`,
                          backgroundColor: `${i[7]}`,
                        }}
                      >
                        {i[0]}
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full gap-2">
                      <div className="flex justify-center text-[18px] text-blue-600">
                        SmarterChild:
                      </div>
                      <div className="text-[18px]">{i[0]}</div>
                    </div>
                  )),
              )}
            </div>
            <div className="mt-6 flex justify-center gap-4 border-2 border-[#cfcdbebf] p-1">
              <label className="color-selector">
                <img
                  src={colorIcon}
                  alt="color"
                  className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568] "
                />
                <input
                  type="color"
                  value={foreColor}
                  onChange={handleForeChange}
                  className="hidden-update"
                />
              </label>
              <label className="color-selector">
                <img
                  src={bgcolorIcon}
                  alt="bgcolor"
                  className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568]"
                />
                <input
                  type="color"
                  value={foreColor}
                  onChange={handleBackChange}
                  className="hidden-update"
                />
              </label>
              <div className="border-r-2 border-r-[#cfcdbebf]"></div>
              <img
                src={smallfontIcon}
                alt="smallfont"
                className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568]"
                onClick={() => {
                  setFontSize(12);
                }}
              />
              <img
                src={normalfontIcon}
                alt="normalfont"
                className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568]"
                onClick={() => {
                  setFontSize(18);
                }}
              />
              <img
                src={bigfontIcon}
                alt="bigfont"
                className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568]"
                onClick={() => {
                  setFontSize(24);
                }}
              />
              <div className="border-r-2 border-r-[#cfcdbebf]"></div>
              <img
                src={boldIcon}
                alt="bold"
                className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568]"
                onClick={() => {
                  setIsBold(!isBold);
                }}
              />
              <img
                src={italicIcon}
                alt="italic"
                className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568]"
                onClick={() => {
                  setIsItalic(!isItalic);
                }}
              />
              <img
                src={underlineIcon}
                alt="underline"
                className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568]"
                onClick={() => {
                  setIsUnderLine(!isUnderLine);
                }}
              />
              <div className="border-r-2 border-r-[#cfcdbebf]"></div>
              <img
                src={linkIcon}
                alt="link"
                className="h-5 w-4 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0"
              />
              <img
                src={peopleIcon}
                alt="people"
                className="h-5 w-4 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0"
              />
              <img
                src={mailIcon}
                alt="mail"
                className="h-5 w-4 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0"
              />
              <img
                src={emoticonIcon}
                alt="emoticon"
                className="h-5 w-4 hover:shadow-[1px_1px_0px_1px_#4a5568]"
                onClick={() => setShowEmojiPicker(true)}
              />
              {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
              <div className="border-r-2 border-r-[#cfcdbebf]"></div>
              <img
                src={addpeopleIcon}
                alt="addpeople"
                className="h-5 w-4 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0"
              />
              <img
                src={messageIcon}
                alt="message"
                className="h-5 w-4 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0"
              />
            </div>

            <input
              placeholder="Input something ..."
              value={inputValue}
              type="text"
              onChange={handleChange}
              onKeyDown={handleEnter}
              className={`${isBold ? 'font-bold' : ''} ${
                isItalic ? 'italic' : 'not-italic'
              } ${isUnderLine ? 'underline' : ''} mt-2 w-full p-2`}
              style={{
                fontSize: `${fontSize}px`,
                color: `${foreColor}`,
                backgroundColor: `${backColor}`,
                height: '100px',
                paddingBottom: '70px',
              }}
            />
          </div>
          <div className="mt-6 flex gap-4 border-2 border-[#cfcdbebf] p-1">
            <div className="flex w-auto gap-2 px-2">
              <img
                src={warningIcon}
                alt="warning"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0 "
                onClick={handleWarn}
              />
              <img
                src={blockIcon}
                alt="block"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0 "
                onClick={handleBlock}
              />
              <div className="border-r-2 border-r-[#cfcdbebf]"></div>
            </div>
            <div className="flex w-full justify-center gap-16 px-2">
              <img
                src={expressionsIcon}
                alt="expressions"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0"
                onClick={handleExpression}
              />
              <img
                src={gamesIcon}
                alt="games"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0 "
                onClick={handleGame}
              />
              <img
                src={videoIcon}
                alt="video"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0 "
              />
              <img
                src={talkIcon}
                alt="talk"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0 "
                onClick={handleTalk}
              />
            </div>
            <div className="border-r-2 border-r-[#cfcdbebf]"></div>
            <div className="w-auto">
              <img
                src={sendIcon}
                alt="send"
                className="h-16 w-[85px] hover:cursor-pointer hover:shadow-[1px_1px_0px_1px_#4a5568]"
                onClick={addHistory}
              />
            </div>
          </div>
        </div>
      </div>
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

export default SmarterChild;

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Picker from 'emoji-picker-react';
import axios from 'axios';
import addpeopleIcon from 'assets/smartchild/addpeople.png';
import bgcolorIcon from 'assets/smartchild/bgcolor.png';
import bigfontIcon from 'assets/smartchild/bigfont.png';
import blockIcon from 'assets/smartchild/block.png';
import boldIcon from 'assets/smartchild/bold.png';
import colorIcon from 'assets/smartchild/color.png';
import emoticonIcon from 'assets/smartchild/emoticon.png';
import expressionsIcon from 'assets/smartchild/expressions.png';
import gamesIcon from 'assets/smartchild/games.png';
import italicIcon from 'assets/smartchild/italic.png';
import linkIcon from 'assets/smartchild/link.png';
import mailIcon from 'assets/smartchild/mail.png';
import messageIcon from 'assets/smartchild/message.png';
import normalfontIcon from 'assets/smartchild/normalfont.png';
import peopleIcon from 'assets/smartchild/people.png';
import sendIcon from 'assets/smartchild/send.png';
import smallfontIcon from 'assets/smartchild/smallfont.png';
import talkIcon from 'assets/smartchild/talk.png';
import underlineIcon from 'assets/smartchild/underline.png';
import videoIcon from 'assets/smartchild/video.png';
import warningIcon from 'assets/smartchild/warning.png';
import audioOut from 'assets/sounds/aim-outgoing.mp3';
import audioIn from 'assets/sounds/aim-incoming.mp3';
import loginsound from 'assets/sounds/loginsound.mp3';

// add child div to capture mouse event when not focused

function SmartChild({ onClose, isFocus }) {
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
  const divRef = useRef();

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleForeChange = event => {
    setForeColor(event.target.value);
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
      'bot',
      false,
      false,
      false,
      18,
      '#000000',
      '#ffffff',
    ];
    setChatHistory(newChatHistory);

    /*if (response.data.choices[0]?.text)
          setTotalText(totalText.concat("A:", response.data.choices[0]?.text));*/
    setLength(length + 1);
    await new Audio(audioOut).play();

    setIsUserInputEnd(false);
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
    await new Audio(audioIn).play();
    setIsUserInputEnd(true);
  };

  const handleEnter = async event => {
    if (event.key !== 'Enter' || inputValue === '') return;

    await addHistory(event);
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
      await delay(700);
      newChatHistory[length] = [
        'Hello! How can I assist you today?',
        'bot',
        false,
        false,
        false,
        18,
        '#000000',
        '#ffffff',
      ];

      setChatHistory(newChatHistory);
      await new Audio(audioOut).play();

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
                        Bot:
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
              />
              <img
                src={blockIcon}
                alt="block"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0 "
              />
              <div className="border-r-2 border-r-[#cfcdbebf]"></div>
            </div>
            <div className="flex w-full justify-center gap-16 px-2">
              <img
                src={expressionsIcon}
                alt="expressions"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0"
              />
              <img
                src={gamesIcon}
                alt="games"
                className="h-16 grayscale hover:shadow-[1px_1px_0px_1px_#4a5568] hover:grayscale-0 "
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

export default SmartChild;

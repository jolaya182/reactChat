/* eslint-disable react/no-danger */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-const */
/**
 * @title: Page.jsx
 * @author: Javier Olaya
 * @date: 8/19/2021
 * @description: main component that holds the page sections
 */
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Container from 'react-bootstrap/Container';
import { useRef, useEffect, useState } from 'react';
import constants from '../constants/constants';

import { Link, NavLink } from 'react-router-dom';
import io from 'socket.io-client';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';
// import Table from 'react-bootstrap/Table';

const ChatForm = ({ sendMessage }) => {
  const [currentText, setCurrentText] = useState('');
  return (
    <div>
      <form>
        <input
          type="text"
          onChange={(e) => setCurrentText(e.target.value)}
          value={currentText}
        ></input>
        <button
          onClick={() => {
            sendMessage(currentText);
            setCurrentText('');
          }}
        >
          send message
        </button>
      </form>
    </div>
  );
};

const LeftMenu = () => {
  return (
    <section>
      <Link to="/history">History</Link>
    </section>
  );
};

const ChatWindow = ({ messages, userName }) => {
  // console.log("ChatWindow ",messages )
  return (
    <section>
      {messages.map((message, index) => {
        const newClassName =
          message.userName === userName ? 'left-chat' : 'right-chat';
        return (
          <div key={'message-' + index}>
            {
              <section className={newClassName}>
                <div>{message.content}</div>
                <div>
                  {message.userName + ' '}
                  {message.timeStamp}
                </div>
              </section>
            }
          </div>
        );
      })}
    </section>
  );
};

export const ChatView = () => {
  const {
    reconnectionDelay,
    reconnection,
    reconnectionAttemps,
    transports,
    agent,
    upgrade,
    rejectUnauthorized,
    chatSizeLimit
  } = constants;

  const [userNa, setUsetNa] = useState('j');
  const [messages, setMessages] = useState([
    {
      userName: 'j',
      content: 'my JJJ currentMessage',
      timeStamp: '2020/2/2'
    },
    {
      userName: 'l',
      content: 'my LLL currentMessage',
      timeStamp: '2020/2/2'
    },
    {
      userName: 'm',
      content: 'my MMM currentMessage',
      timeStamp: '2020/2/2'
    }
  ]);

  const socketRef = useRef();
  socketRef.current = io.connect('http://localhost:3000', {
    reconnectionDelay,
    reconnection,
    reconnectionAttemps,
    transports,
    agent,
    upgrade,
    rejectUnauthorized
  });

  const enforceChatSize = (chatArray) => {
    if (chatArray.length >= chatSizeLimit) {
      chatArray.shift();
    }
    return chatArray;
  };

  useEffect(() => {
    if (!socketRef.current) return;
    console.log('messages length', messages);
    window.localStorage.setItem('userName', JSON.stringify(userNa));
    if (messages.length != 0)
      setMessages(JSON.parse(window.localStorage.getItem('messages')) || []);

    const newMessages = (incomingmessages) => {
      setMessages((prvMessages) => {
        const newMessages = [...enforceChatSize(prvMessages), incomingmessages];
        window.localStorage.setItem('messages', JSON.stringify(newMessages));
        return newMessages;
      });
    };
    socketRef.current.on('receiveMessage', newMessages);
    return () => {
      socketRef.current.off('receiveMessage');
      // socketRef.current.off("incomingMessage")
    };
  }, []);

  const sendMessage = (typedMessage) => {
    const newDate = new Date();
    const newTypeMessage = {
      userName: userNa,
      content: typedMessage,
      timeStamp: newDate.toLocaleString('en', { timeZone: 'UTC' })
    };

    socketRef.current.emit('sendMessage', newTypeMessage);
  };

  const clearHistory = () => {
    window.localStorage.setItem('messages', JSON.stringify([]));
    setMessages([]);
  };

  return (
    <section>
      <LeftMenu>leftMenu</LeftMenu>
      <ChatWindow messages={messages} userName={userNa}>
        chatWindow
      </ChatWindow>
      <section>form</section>
      <ChatForm sendMessage={sendMessage} />
      <button onClick={clearHistory}>Clear History</button>
    </section>
  );
};

export const ChatHistory = () => {
  const [messages, setMessages] = useState([]);
  const [userNa, setUserNa] = useState("");
  useEffect(() => {
    // if (messages.length )
      setMessages(JSON.parse(window.localStorage.getItem('messages')) || []);
      setUserNa(JSON.parse(window.localStorage.getItem('userName')) || "")
  }, []);
  return (
    <section>
      <Link to='/'>Chat View</Link>
      <div>ChatHistory</div>
      {messages.map((message, index) => {
        const newClassName =
          message.userName === userNa ? 'left-chat' : 'right-chat';
        return (
          <div key={'message-' + index}>
            {
              <section className={newClassName}>
                <div>{message.content}</div>
                <div>
                  {message.userName + ' '}
                  {message.timeStamp}
                </div>
              </section>
            }
          </div>
        );
      })}
    </section>
  );
};

export const Whoops404 = ({ location }) => {
  return (
    <div>
      <h1>
        Resources not found at
        {`${location.pathname}`}
      </h1>
    </div>
  );
};

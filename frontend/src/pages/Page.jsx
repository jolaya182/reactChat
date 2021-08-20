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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
      <Form>
        <Form.Group>
        <Form.Control
          type="text"
          onChange={(e) => setCurrentText(e.target.value)}
          value={currentText}
        ></Form.Control>
        <Button
          onClick={() => {
            sendMessage(currentText);
            setCurrentText('');
          }}
        >
          send message
        </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

const LeftMenu = ({userList}) => {
  console.log("userlist", userList)
  return (
    <section>
      <Link to="/history">History</Link>
      {Object.keys(userList).map((userProp, index)=>{
        return(
          <div key={"user-"+index}> {userList[userProp]} </div>
        );
      })}
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
  const [users, setUsers] = useState({});
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
    window.localStorage.setItem('userName', JSON.stringify(userNa));

    socketRef.current.emit("joinChat", userNa);

    if (messages.length != 0)
      setMessages(JSON.parse(window.localStorage.getItem('messages')) || []);

    const newMessages = (incomingmessages) => {
      setMessages((prvMessages) => {
        const newMessages = [...enforceChatSize(prvMessages), incomingmessages];
        window.localStorage.setItem('messages', JSON.stringify(newMessages));
        return newMessages;
      });
    };
    const newUsers = (incomingUsers)=>{
      console.log("newUsers", incomingUsers);
      setUsers(() => {
        const newUsers = {...incomingUsers};
        return newUsers;
      });
    }

    socketRef.current.on('receiveMessage', newMessages);
    socketRef.current.on('addedUsersToChatRoom', newUsers)
    return () => {
      socketRef.current.off('receiveMessage');
      socketRef.current.off('addedUsersToChatRoom')

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
    <Container>
      <Row>
        <Col sm={2}>
        <LeftMenu userList={users}>leftMenu</LeftMenu>
        </Col>
      <Col>
      <Row>
        <Col>
          <ChatWindow messages={messages} userName={userNa}>
          chatWindow
      </ChatWindow>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChatForm sendMessage={sendMessage} />
          
        <Button onClick={clearHistory}>Clear History</Button>
        </Col>
      </Row>
    </Col>
    </Row>
    </Container>
  );
};

export const ChatHistory = () => {
  const [messages, setMessages] = useState([]);
  const [userNa, setUserNa] = useState("");
  useEffect(() => {
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

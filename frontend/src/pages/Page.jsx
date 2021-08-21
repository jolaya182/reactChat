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
import Modal from 'react-bootstrap/Modal';
import { useRef, useEffect, useState } from 'react';
import constants from '../constants/constants';
import FetchApi from '../components/FetchApi';
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
    chatSizeLimit,
    autoConnect,
    url
  } = constants;

  const [userNa, setUserNa] = useState('');
  const [users, setUsers] = useState({});
  const [modal, setModal] = useState(true);
  const [messages, setMessages] = useState([]);

  const socketRef = useRef();
  const setAllCurrentUsers = (users)=>{
    setUsers(users);
  }
  const enforceChatSize = (chatArray) => {
    if (chatArray.length >= chatSizeLimit) {
      chatArray.shift();
    }
    return chatArray;
  };

  useEffect(() => {
    if (!socketRef) return;
    socketRef.current = io.connect('http://localhost:3000', {
      reconnectionDelay,
      reconnection,
      reconnectionAttemps,
      transports,
      agent,
      upgrade,
      rejectUnauthorized,
      autoConnect
    });
  
    // socketRef.current.on("connect", ()=>{socketRef.current.sendBuffer = []})
    console.log("useEffect")
    window.localStorage.setItem('userName', JSON.stringify(userNa));
    setUserNa(()=>JSON.parse(window.localStorage.getItem('userName')) || []);  
    if (messages.length != 0)
      setMessages(JSON.parse(window.localStorage.getItem('messages')) || []);

      FetchApi(`${url}/`, 'GET', setAllCurrentUsers, {}); 

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
      socketRef.current.close();

    };
  }, []);

  const sendMessage = (typedMessage) => {
    const newDate = new Date();
    const newTypedMessage = {
      userName: userNa,
      content: typedMessage,
      timeStamp: newDate.toLocaleString('en', { timeZone: 'UTC' })
    };
    setMessages((prevMessages)=>[...prevMessages, newTypedMessage]);
    socketRef.current.emit('sendMessage', newTypedMessage);
  };
  const clearHistory = () => {
    window.localStorage.setItem('messages', JSON.stringify([]));
    setMessages([]);
  };
  const updateUserName = (e)=>{
    const {target} = e;
    const {value} = target;
    console.log("value", value)
    setUserNa(value)

  }

  const isUserString = ()=>{
    if(isNaN(userNa)){
      setModal(false);
      socketRef.current.emit("joinChat", userNa);
      window.localStorage.setItem('userName', JSON.stringify(userNa));
      console.log("socketRef.current", socketRef.current)
      const newUser = {"me":userNa}
      setUsers((prevUsers)=>{console.log("prevUsers", prevUsers); return {...prevUsers,  ...newUser } } );
    }
  }

  return (
    <Container>
      <Modal
      show={ modal }
      onHide={(f)=>f}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Simple Chat</Modal.Title>
          </Modal.Header>  
        <Modal.Body>
          Please insert a user name
        </Modal.Body>
        <Form>
        <Form.Control
          type="text"
          onChange={(e)=>updateUserName(e)}
          value={userNa}
        ></Form.Control>
        </Form>  
        <Modal.Footer>
          <Button variant="secondary" onClick={(e)=>isUserString(e)}>Close</Button>
        </Modal.Footer>
    </Modal> 
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

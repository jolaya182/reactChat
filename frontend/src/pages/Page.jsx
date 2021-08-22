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
import { Link } from 'react-router-dom';
import io from 'socket.io-client';


const ChatDisplay = ({userNa, messages})=>{
return (
  <section className="chat-window-wrapper">
  <div className="chat-window">
    {messages.map((message, index) => {
      const newClassName =
        message.userName === userNa
          ? 'chat-bubble-left'
          : 'chat-bubble-right';
      return (
        <section className={newClassName} key={'message-' + index}>
          <div className={'chat-bubble-fill'}>{message.content}</div>
          <div>
            {message.userName + ' '}
            {message.timeStamp}
          </div>
        </section>
      );
    })}
  </div>
</section>
)
} 


const ChatForm = ({ sendMessage, clearHistory, clearLocalStorage }) => {
  const [currentText, setCurrentText] = useState('');

  return (
    <Form
      className="chat-form"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(currentText);
        setCurrentText('');
      }}
    >
      <Form.Group>
        <Form.Control
          type="text"
          onChange={(e) => {
            e.preventDefault();
            setCurrentText(e.target.value);
          }}
          value={currentText}
        ></Form.Control>
        <Button
          onClick={() => {
            sendMessage(currentText);
            setCurrentText('');
          }}
        >
          Send Message
        </Button>
        <Button onClick={clearHistory}>Clear History</Button>
        <Button onClick={clearLocalStorage}>Clear Local Storage</Button>
      </Form.Group>
    </Form>
  );
};

const LeftMenu = ({ userList }) => {
  return (
    <section className="left-menu">
      <Link className="left-menu-chaters" to="/history">History</Link>
      {Object.keys(userList).map((userProp, index) => {
        return <div className="left-menu-chaters" key={'user-' + index}> {userList[userProp]} </div>;
      })}
    </section>
  );
};

const ChatWindow = ({ messages, userName }) => {
  return (
    <ChatDisplay messages={messages} userNa={userName}></ChatDisplay>
  );
};

export const ChatView = () => {
  let userNamePreviouslySet = '';
  let isShowModelSet = true;
  userNamePreviouslySet =
    JSON.parse(window.localStorage.getItem('userName')) || false;
  const messagePreviouslySet =
    JSON.parse(window.localStorage.getItem('messages')) || [];

  if (userNamePreviouslySet) {
    isShowModelSet = false;
  } else {
    userNamePreviouslySet = '';
  }
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

  const [userNa, setUserNa] = useState(userNamePreviouslySet);
  const [users, setUsers] = useState({});
  const [showModal, setShowModal] = useState(isShowModelSet);
  const [messages, setMessages] = useState(messagePreviouslySet);

  const socketRef = useRef();
  const setAllCurrentUsers = (users) => {
    setUsers(users);
  };
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
    const newUsers = (incomingUsers) => {
      setUsers(() => {
        const newUsers = { ...incomingUsers };
        return newUsers;
      });
    };

    socketRef.current.on('receiveMessage', newMessages);
    socketRef.current.on('addedUsersToChatRoom', newUsers);
    return () => {
      socketRef.current.off('receiveMessage');
      socketRef.current.off('addedUsersToChatRoom');
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
    
    setMessages((prevMessages) => {
      const newMessages = [
      ...enforceChatSize(prevMessages),
      newTypedMessage
    ];
    window.localStorage.setItem('messages', JSON.stringify( newMessages));
    return newMessages
  });

    socketRef.current.emit('sendMessage', newTypedMessage);
  };

  const clearHistory = () => {
    window.localStorage.setItem('messages', JSON.stringify([]));
    setMessages([]);
  };
  const updateUserName = (e) => {
    const { target } = e;
    const { value } = target;
    setUserNa(value);
  };

  const isUserString = () => {
    if (isNaN(userNa)) {
      setShowModal(false);
      socketRef.current.emit('joinChat', userNa);
      window.localStorage.setItem('userName', JSON.stringify(userNa));
      const newUser = { me: userNa };
      setUsers((prevUsers) => {
        return { ...prevUsers, ...newUser };
      });
    }
  };
  const clearLocalStorage = () => {
    window.localStorage.clear();
  };

  return (
    <Container >
      <Modal show={showModal} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Simple Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please insert a user name</Modal.Body>
        <Form>
          <Form.Control
            type="text"
            onChange={(e) => {
              e.preventDefault();
              updateUserName(e);
            }}
            value={userNa}
          ></Form.Control>
        </Form>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              isUserString(e);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="rowm">
        <div className="colm">
          <LeftMenu userList={users}>leftMenu</LeftMenu>
        </div>
        <Col >
          <Row>
            <Col>
              <ChatWindow messages={messages} userName={userNa}>
                chatWindow
              </ChatWindow>
              <ChatForm sendMessage={sendMessage} 
              clearHistory={()=>clearHistory()} 
              clearLocalStorage={()=>clearLocalStorage()} />

            </Col>
          </Row>
        </Col>
      </div>
    </Container>
  );
};

export const ChatHistory = () => {
  const [messages, setMessages] = useState([]);
  const [userNa, setUserNa] = useState('');
  useEffect(() => {
    setMessages(JSON.parse(window.localStorage.getItem('messages')) || []);
    setUserNa(JSON.parse(window.localStorage.getItem('userName')) || '');
  }, []);
  console.log('added messages', messages);
  return (
    <Container >
      <div className="rowm">
        <div  className="left-menu">
          <Link className="left-menu-chaters" to="/">Chat View</Link>
          
        </div >
        <Col>
          <ChatDisplay messages={messages} userNa={userNa}></ChatDisplay>
        </Col>
      </div>
    </Container>
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

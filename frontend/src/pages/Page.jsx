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
import { useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import io from 'socket.io-client'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';
// import Table from 'react-bootstrap/Table';

export const MainTemplate = ({children}) =>{
  return (<div>
    `MainTemplate`
    {children}
  </div>);
}

export const ChatView = () =>{
  const socketRef = useRef();
  socketRef.current = io.connect('http://localhost:3000', {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttemps: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false
    });

  socketRef.current.emit('sendMessage', "holly smokes!");
  useEffect(()=>{
    if(!socketRef.current)return;
    socketRef.current.on("receiveMessage", (comingMessage)=>{console.log("incomingMessage", comingMessage)})
    return ()=>{
      socketRef.current.off("receiveMessage");
    }
  }, [])

  
  return(<MainTemplate>
      <section>
        `chatView`
      </section>
    </MainTemplate>)
}

export const ChatHistory = ()=>{
  return(
    <MainTemplate>
      <section></section>
    </MainTemplate>
  )
}

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

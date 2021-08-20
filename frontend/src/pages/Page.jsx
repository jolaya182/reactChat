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
import { Link, NavLink } from 'react-router-dom';
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

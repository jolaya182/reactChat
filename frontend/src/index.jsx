/* eslint-disable no-unused-vars */
/**
 * @title: index.jsx
 * @author: Javier Olaya
 * @date: 6/23/2021
 * @description: main file used to render the application
 */
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './components/App';

import styles from '../styles/index.scss';

render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

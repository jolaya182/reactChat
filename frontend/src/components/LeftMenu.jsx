/**
 * @title: LeftMenu.jsx
 * @author: Javier Olaya
 * @date: 8/19/2021
 * @description: main component that holds the list of online chaters
 */

import { Link } from 'react-router-dom';

const LeftMenu = ({ userList }) => {
  return (
    <section className="left-menu">
      <Link className="left-menu-chaters" to="/history">
        History
      </Link>
      {Object.keys(userList).map((userProp, index) => {
        return (
          <div className="left-menu-chaters" key={'user-' + index}>
            {' '}
            {userList[userProp]}{' '}
          </div>
        );
      })}
    </section>
  );
};
export default LeftMenu;

/* eslint-disable react/jsx-props-no-spreading */
/**
 * @title: Applcation.jsx
 * @author: Javier Olaya
 * @date: 8/19/2021
 * @description: Main container for page routing and inital
 */
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Whoops404, ChatView, ChatHistory } from '../pages/Page';
import constants from '../constants/constants';

/**
 * Main App component that fetches the initial podcast show data
 * @return {html}
 */
const App = () => {
  const { URL } = constants;

  return (
        <HashRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <ChatView
                  {...props}
                  client={"client"}
                  podcastQueue={"state.podcastQueue"}
                />
              )}
            />
            <Route
              exact
              path="/history"
              render={(props) => (
                <ChatHistory
                  {...props}
                  podcastData={"state.podcastData"}
                  podcastQueue={"state.podcastQueue"}
                />
              )}
            />
            <Route component={Whoops404} />
          </Switch>
        </HashRouter>
  );
};

export default App;

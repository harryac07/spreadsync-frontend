import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme/muiTheme';

import Navigation from 'components/Navigation';
import Main from 'containers/Main';

const App = ({ store }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <Provider store={store}>
          <Router>
            <Navigation />
            <div>
              <Switch>
                <Route path="/projects/:id">Project detail</Route>
                <Route path="/projects">Projects</Route>
                <Route path="/integrations">Integrations</Route>
                <Route path="/teams">Teams</Route>
                <Route path="/logout">Logout. Delete session data and pushes to /login page</Route>
                <Route path="/login">Login. Push user to / page to fetch more user related data</Route>
                <Route path="/callback">Callback. This will be callback page for oauth2</Route>
                <Route path="/" exact component={Main} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </div>
    </MuiThemeProvider>
  );
};
export default App;

export const Root = () => <App />;

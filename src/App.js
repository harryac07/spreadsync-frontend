import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme/muiTheme';
import { toast } from 'react-toastify';

import Main from 'containers/Main';
import Auth from 'containers/Auth';
import EmailConfirmation from 'containers/Auth/EmailConfirmation';

import './app.css';
import 'react-toastify/dist/ReactToastify.css';

// configure react toastify
toast.configure({
  autoClose: 3000,
  draggable: false,
  hideProgressBar: true,
  newestOnTop: true,
});

const App = ({ store }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <Provider store={store}>
          <Router>
            <Switch>
              {/* Unprotected route */}
              <Route path="/signup" component={Auth} view="signup" />
              <Route path="/login" component={Auth} view="login" />
              <Route path="/confirmation" component={EmailConfirmation} />
              <Route path="/logout" component={Auth} />

              {/* Protected route */}
              <Route path="/" component={Main} />
            </Switch>
          </Router>
        </Provider>
      </div>
    </MuiThemeProvider>
  );
};
export default App;

export const Root = () => <App />;

import React from 'react';
import { connect, Provider } from 'react-redux';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { checkUserAuth } from './action';

import { MainWrapper } from 'components/common/MainWrapper';
import WrapperWithNavigation from 'components/WrapperWithNavigation';
import Projects from 'containers/Projects';
import ProjectDetail from 'containers/ProjectDetail';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }
  componentDidMount() {
    const token = localStorage.getItem('token');

    const tokenPayload = jwt.decode(token) || {};
    const { exp = 0, user = {} } = tokenPayload;

    if (moment(exp * 1000).isSameOrBefore(moment().format()) || !user.id) {
      this.props.history.push('/logout');
      return;
    }
    localStorage.setItem('user_id', user.id);
    this.props.history.push('/projects');
  }
  render() {
    return (
      <WrapperWithNavigation>
        <MainWrapper>
          <Switch>
            <Route path="/projects/:id" component={ProjectDetail} />
            <Route path="/projects" component={Projects} />
            <Route path="/integrations">Integrations</Route>
            <Route path="/teams">Teams</Route>
            <Route path="/profile">Profile and Account</Route>
            <Route path="/setting">Setting</Route>
          </Switch>
        </MainWrapper>
      </WrapperWithNavigation>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app,
  };
};

export default connect(mapStateToProps, {
  checkUserAuth,
})(Main);

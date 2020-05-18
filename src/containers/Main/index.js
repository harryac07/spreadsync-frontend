import React from 'react';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { checkUserAuth } from './action';

import { MainWrapper } from 'components/common/MainWrapper';
import WrapperWithNavigation from 'components/WrapperWithNavigation';
import Projects from 'containers/Projects';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }
  componentDidMount() {
    /* 
        - We will check if user is successfully logged in  and push to /projects if everything is ok. 
        - Force user to login page again otherwise
    */
    // const token = localStorage.getItem('token');
    // this.props.checkUserAuth(token);

    /* Until auth is ready, set logged in true */
    this.props.history.push('/projects');
  }
  componentDidUpdate(prevProps, prevState) {
    // const { loggedIn } = this.props.app;
    // console.log(prevProps.app.loggedIn, this.props.app.loggedIn);
    // if (prevProps.app.loggedIn !== loggedIn && loggedIn) {
    //   this.props.history.push('/projects');
    // } else {
    //   this.props.history.push('/auth');
    // }
  }
  render() {
    return (
      <WrapperWithNavigation>
        <MainWrapper>
          <Switch>
            <Route path="/projects/:id">Project detail</Route>
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

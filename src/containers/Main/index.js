import React from 'react';
import { connect } from 'react-redux';
import { checkUserAuth } from './action';

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
    const token = localStorage.getItem('token');
    this.props.checkUserAuth(token);
  }
  componentDidUpdate(prevProps, prevState) {
    const { loggedIn = false } = this.props.app;
    if (prevProps.app.loggedIn !== loggedIn && loggedIn) {
      this.props.history.push('/projects');
    } else {
      this.props.history.push('/logout');
    }
  }
  render() {
    return <div></div>;
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

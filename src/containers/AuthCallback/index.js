import React from 'react';
import * as queryString from 'query-string';

class AuthCallback extends React.Component {
  componentDidMount() {
    const redirectProjectId = localStorage.getItem('current_project');
    const parsedQueryString = queryString.parse(this.props.location.search);
    const { error, code } = parsedQueryString;
    if (code) {
      console.log('code ', code);
      localStorage.setItem('g_acode', code);
    }
  }
  render() {
    return <div />;
  }
}

export default AuthCallback;

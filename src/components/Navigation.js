import React from 'react';
import { Link } from 'react-router-dom';

class Navigation extends React.Component {
  render() {
    return (
      <div>
        <Link to="/projects">Projects</Link>&nbsp;
        <Link to="/teams">Teams</Link>&nbsp;
        <Link to="/integrations">Integrations</Link>&nbsp;
        <Link to="/login">Login</Link>&nbsp;
        <Link to="/logout">Logout</Link>&nbsp;
        <br />
        <br />
      </div>
    );
  }
}

export default Navigation;

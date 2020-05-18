import React from 'react';
import { connect } from 'react-redux';
import { test } from './action';

class Test extends React.Component {
  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app,
  };
};

export default connect(mapStateToProps, {
  test,
})(Test);

import React from 'react';
import { connect } from 'react-redux';
import { test } from './action';
import { MainWrapper } from 'components/common/MainWrapper';

class Test extends React.Component {
  render() {
    return (
      <MainWrapper>
        <p>Register</p>
      </MainWrapper>
    );
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

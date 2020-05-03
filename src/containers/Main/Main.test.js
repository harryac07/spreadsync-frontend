import React from 'react';
import { put, call } from 'redux-saga/effects';
import '@testing-library/jest-dom/extend-expect';

import { CHECK_AUTH_REQUEST, CHECK_AUTH_REQUEST_SUCCEED } from './constant';
import reducer from './reducer';
import { checkUserAuthentication, checkUserAuthenticationSaga } from 'containers/Main/saga';

const initialState = { loggedIn: false };

describe('Auth saga should make authenticate request', () => {
  it('Should dispatch login action', async () => {
    const action = {
      type: CHECK_AUTH_REQUEST,
      payload: 'test-token',
    };
    const apiResponse = {
      username: 'test2',
    };

    const generator = checkUserAuthenticationSaga(action);
    expect(generator.next().value).toEqual(call(checkUserAuthentication));
    expect(generator.next(apiResponse).value).toEqual(
      put({
        type: CHECK_AUTH_REQUEST_SUCCEED,
        payload: apiResponse,
      })
    );
  });

  it('Should login user after successful login attempt', () => {
    const action = {
      type: CHECK_AUTH_REQUEST_SUCCEED,
      payload: 'test-token',
    };
    const newState = reducer(initialState, action);
    expect(newState.loggedIn).toEqual(true);
  });
});

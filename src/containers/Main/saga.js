import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL } from 'env';

import { CHECK_AUTH_REQUEST, CHECK_AUTH_REQUEST_SUCCEED, CHECK_AUTH_REQUEST_FAILED } from './constant';

export const checkUserAuthentication = () => {
  //   return axios.get(`${API_URL}/users/`).then((response) => {
  axios.get(`https://jsonplaceholder.typicode.com/todos/1`).then((response) => {
    // return response.data;
    return {
      username: 'test',
    };
  });
};
export function* checkUserAuthenticationSaga(action) {
  try {
    const data = yield call(checkUserAuthentication);
    yield put({
      type: CHECK_AUTH_REQUEST_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: CHECK_AUTH_REQUEST_FAILED,
      error: 'Something went wrong!',
    });
  }
}

export const appSaga = [takeEvery(CHECK_AUTH_REQUEST, checkUserAuthenticationSaga)];

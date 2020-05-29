import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL } from 'env';

import { SIGNUP, SIGNUP_SUCCEED, SIGNUP_FAILED, LOGIN, LOGIN_SUCCEED, LOGIN_FAILED } from './constant';

const signup = (payload) => {
  return axios.post(`${API_URL}/auth/signup`, payload).then((response) => {
    return response.data;
  });
};
export function* signupSaga(action) {
  try {
    const data = yield call(signup, action.data);
    yield put({
      type: SIGNUP_SUCCEED,
      payload: data,
    });
    /* Redirect to /login page */
    action.history.push('/login');
  } catch (error) {
    yield put({
      type: SIGNUP_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

const login = (payload) => {
  return axios.post(`${API_URL}/auth/login`, payload).then((response) => {
    return response.data;
  });
};
export function* loginSaga(action) {
  try {
    const data = yield call(login, action.data);
    localStorage.setItem('token', data.token);
    yield put({
      type: LOGIN_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: LOGIN_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

export const authSaga = [takeEvery(SIGNUP, signupSaga), takeEvery(LOGIN, loginSaga)];

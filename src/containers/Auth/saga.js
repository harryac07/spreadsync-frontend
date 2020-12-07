import { call, put, takeEvery } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from 'env';

import {
  SIGNUP,
  SIGNUP_SUCCEED,
  SIGNUP_FAILED,
  LOGIN,
  LOGIN_SUCCEED,
  LOGIN_FAILED,
  CONFIRM_EMAIL,
  CONFIRM_EMAIL_FAILED,
  CONFIRM_EMAIL_SUCCEED,
} from './constant';

const signup = (payload, queryToken) => {
  const params = queryToken
    ? new URLSearchParams({
        token: queryToken,
      })
    : '';
  return axios.post(`${API_URL}/auth/signup?${params}`, payload).then((response) => {
    return response.data;
  });
};
export function* signupSaga(action) {
  try {
    const data = yield call(signup, action.data, action.extra.token);
    yield put({
      type: SIGNUP_SUCCEED,
      payload: data,
    });
    /* Redirect to /login page or ask for email verification */
    if (action.extra.token) {
      toast.info('Registration successful!. Now, log in and enjoy :) &#128522');
      action.extra.history.push('/login');
    }
  } catch (error) {
    yield put({
      type: SIGNUP_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

const login = ({ data, auth }) => {
  if (auth === 'google') {
    return axios.post(`${API_URL}/auth/login/google`, data).then((response) => {
      return response.data;
    });
  }
  return axios.post(`${API_URL}/auth/login`, data).then((response) => {
    return response.data;
  });
};
export function* loginSaga(action) {
  try {
    const data = yield call(login, action);
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

const confirmEmail = (token) => {
  return axios.post(`${API_URL}/auth/activate-user`, { token }).then((response) => {
    return response.data;
  });
};
export function* confirmEmailSaga(action) {
  try {
    const data = yield call(confirmEmail, action.data);
    yield put({
      type: CONFIRM_EMAIL_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: CONFIRM_EMAIL_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

export const authSaga = [
  takeEvery(SIGNUP, signupSaga),
  takeEvery(LOGIN, loginSaga),
  takeEvery(CONFIRM_EMAIL, confirmEmailSaga),
];

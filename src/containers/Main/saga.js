import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from 'env';

import {
  FETCH_ALL_USER_ACCOUNTS,
  FETCH_ALL_USER_ACCOUNTS_SUCCEED,
  FETCH_ALL_USER_ACCOUNTS_FAILED,
  FETCH_CURRENT_USER_BY_ID,
  FETCH_CURRENT_USER_BY_ID_SUCCEED,
  FETCH_CURRENT_USER_BY_ID_FAILED,
  CREATE_ACCOUNT,
  CREATE_ACCOUNT_SUCCEED,
  CREATE_ACCOUNT_FAILED,
} from './constant';

export const fetchAllAccountsForUser = (userId) => {
  return axios
    .get(`${API_URL}/users/${userId}/accounts`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* fetchAllAccountsForUserSaga(action) {
  try {
    const data = yield call(fetchAllAccountsForUser, action.id);
    yield put({
      type: FETCH_ALL_USER_ACCOUNTS_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: FETCH_ALL_USER_ACCOUNTS_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

export const fetchCurrentUser = (userId) => {
  return axios
    .get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* fetchCurrentUserSaga(action) {
  try {
    const data = yield call(fetchCurrentUser, action.id);
    yield put({
      type: FETCH_CURRENT_USER_BY_ID_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: FETCH_CURRENT_USER_BY_ID_FAILED,
      error: error.response ? error.response?.data?.message : 'Something went wrong!',
    });
  }
}

export const createAccount = (payload) => {
  return axios
    .post(`${API_URL}/accounts/`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* createAccountSaga(action) {
  try {
    const data = yield call(createAccount, action.data);
    yield put({
      type: CREATE_ACCOUNT_SUCCEED,
      payload: data,
    });
    yield put({
      type: FETCH_ALL_USER_ACCOUNTS,
      id: action.userId,
    });
    yield put({
      type: FETCH_CURRENT_USER_BY_ID,
      id: action.userId,
    });
  } catch (error) {
    yield put({
      type: CREATE_ACCOUNT_FAILED,
      error: error.response ? error.response?.data?.message : 'Something went wrong!',
    });
    toast.error(`Account creation failed! ${error?.response?.data?.message}`);
  }
}

export const appSaga = [
  takeEvery(FETCH_ALL_USER_ACCOUNTS, fetchAllAccountsForUserSaga),
  takeEvery(FETCH_CURRENT_USER_BY_ID, fetchCurrentUserSaga),
  takeEvery(CREATE_ACCOUNT, createAccountSaga),
];

import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL } from 'env';

import {
  FETCH_ALL_USER_ACCOUNTS,
  FETCH_ALL_USER_ACCOUNTS_SUCCEED,
  FETCH_ALL_USER_ACCOUNTS_FAILED,
  FETCH_CURRENT_USER_BY_ID,
  FETCH_CURRENT_USER_BY_ID_SUCCEED,
  FETCH_CURRENT_USER_BY_ID_FAILED,
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

export const appSaga = [
  takeEvery(FETCH_ALL_USER_ACCOUNTS, fetchAllAccountsForUserSaga),
  takeEvery(FETCH_CURRENT_USER_BY_ID, fetchCurrentUserSaga),
];

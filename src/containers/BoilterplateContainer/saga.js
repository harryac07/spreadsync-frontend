import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL } from 'env';

import { TEST_REQUEST, TEST_REQUEST_SUCCEED, TEST_REQUEST_FAILED } from './constant';

const checkTest = () => {
  //   return axios.get(`${API_URL}/test/`).then((response) => {
  //     return response.data;
  //   });
  return {
    username: 'test',
  };
};
export function* checkTestSaga(action) {
  try {
    const data = yield call(checkTest);
    yield put({
      type: TEST_REQUEST_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: TEST_REQUEST_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

/* Add the saga to rootsaga in store/sagas.js */
export const testSaga = [takeEvery(TEST_REQUEST, checkTestSaga)];

import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL } from 'env';

import { FETCH_PROJECTS, FETCH_PROJECTS_SUCCEED, FETCH_PROJECTS_FAILED } from './constant';

const fetchProjects = () => {
    console.log(`${API_URL}/projects/`)
  return axios.get(`${API_URL}/projects/`).then((response) => {
    return response.data;
  });
};
export function* fetchProjectsSaga(action) {
  try {
    const data = yield call(fetchProjects);
    yield put({
      type: FETCH_PROJECTS_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: FETCH_PROJECTS_FAILED,
      error: 'Something went wrong!',
    });
  }
}

/* Add the saga to rootsaga in store/sagas.js */
export const saga = [takeEvery(FETCH_PROJECTS, fetchProjectsSaga)];

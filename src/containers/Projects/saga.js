import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL } from 'env';

import {
  FETCH_PROJECTS,
  FETCH_PROJECTS_SUCCEED,
  FETCH_PROJECTS_FAILED,
  CREATE_PROJECT,
  CREATE_PROJECT_SUCCEED,
  CREATE_PROJECT_FAILED,
} from './constant';

const fetchProjects = () => {
  return axios
    .get(`${API_URL}/projects/`, {
      headers: {
        Authorization: `bearer ${localStorage.getItem('token')}`,
        account_id: `${localStorage.getItem('account_id')}`,
      },
    })
    .then((response) => {
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
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

export const createProject = (payload) => {
  return axios
    .post(`${API_URL}/projects/`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* createProjectSaga(action) {
  try {
    const data = yield call(createProject, action.data);
    yield put({
      type: CREATE_PROJECT_SUCCEED,
      payload: data,
    });
    // Re-fetch projects
    yield put({
      type: FETCH_PROJECTS,
    });
  } catch (error) {
    yield put({
      type: CREATE_PROJECT_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

export const saga = [takeEvery(FETCH_PROJECTS, fetchProjectsSaga), takeEvery(CREATE_PROJECT, createProjectSaga)];

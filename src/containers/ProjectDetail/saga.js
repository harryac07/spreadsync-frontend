import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL } from 'env';

import {
  FETCH_PROJECT,
  FETCH_PROJECT_SUCCEED,
  FETCH_PROJECT_FAILED,
  FETCH_ALL_JOBS,
  FETCH_ALL_JOBS_SUCCEED,
  FETCH_ALL_JOBS_FAILED,
  CREATE_JOB,
  CREATE_JOB_SUCCEED,
  CREATE_JOB_FAILED
} from './constant';

const fetchProject = projectId => {
  return axios
    .get(`${API_URL}/projects/${projectId}/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      return response.data;
    });
};
export function* fetchProjectSaga(action) {
  try {
    const data = yield call(fetchProject, action.id);
    yield put({
      type: FETCH_PROJECT_SUCCEED,
      payload: data
    });
  } catch (error) {
    yield put({
      type: FETCH_PROJECT_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!'
    });
  }
}

const fetchAllProjectJobs = projectId => {
  return axios
    .get(`${API_URL}/projects/${projectId}/jobs/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      return response.data;
    });
};
export function* fetchAllProjectJobsSaga(action) {
  try {
    const data = yield call(fetchAllProjectJobs, action.id);
    yield put({
      type: FETCH_ALL_JOBS_SUCCEED,
      payload: data
    });
  } catch (error) {
    yield put({
      type: FETCH_ALL_JOBS_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!'
    });
  }
}

const createJobForProject = payload => {
  return axios
    .post(`${API_URL}/jobs/`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      return response.data;
    });
};
export function* createJobForProjectSaga(action) {
  try {
    const data = yield call(createJobForProject, action.payload);
    yield put({
      type: CREATE_JOB_SUCCEED
    });
  } catch (error) {
    yield put({
      type: CREATE_JOB_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!'
    });
  }
}

export const projectDetailSaga = [
  takeEvery(FETCH_PROJECT, fetchProjectSaga),
  takeEvery(FETCH_ALL_JOBS, fetchAllProjectJobsSaga)
];

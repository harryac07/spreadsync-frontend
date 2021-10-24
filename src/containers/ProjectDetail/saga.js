import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from 'env';

import {
  FETCH_PROJECT,
  FETCH_PROJECT_SUCCEED,
  FETCH_PROJECT_FAILED,
  FETCH_ALL_JOBS,
  FETCH_ALL_JOBS_SUCCEED,
  FETCH_ALL_JOBS_FAILED,
  CREATE_JOB_SUCCEED,
  CREATE_JOB_FAILED,
  DELETE_JOB,
  DELETE_JOB_SUCCEED,
  DELETE_JOB_FAILED,
  FETCH_ALL_TEAM_MEMBERS,
  FETCH_ALL_TEAM_MEMBERS_SUCCEED,
  FETCH_ALL_TEAM_MEMBERS_FAILED,
  INVITE_TEAM_MEMBERS,
  INVITE_TEAM_MEMBERS_SUCCEED,
  INVITE_TEAM_MEMBERS_FAILED,
  REMOVE_TEAM_MEMBER,
  REMOVE_TEAM_MEMBER_SUCCEED,
  REMOVE_TEAM_MEMBER_FAILED,
  UPDATE_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER_SUCCEED,
  UPDATE_TEAM_MEMBER_FAILED,
  CLONE_JOB,
  CLONE_JOB_SUCCEED,
  CLONE_JOB_FAILED,
  FETCH_WORKFLOW_BY_ID,
  FETCH_WORKFLOW_BY_ID_SUCCEED,
  FETCH_WORKFLOW_BY_ID_FAILED,
  FETCH_WORKFLOW_BY_PROJECT,
  FETCH_WORKFLOW_BY_PROJECT_SUCCEED,
  FETCH_WORKFLOW_BY_PROJECT_FAILED,
} from './constant';

const fetchProject = (projectId) => {
  return axios
    .get(`${API_URL}/projects/${projectId}/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* fetchProjectSaga(action) {
  try {
    const data = yield call(fetchProject, action.id);
    yield put({
      type: FETCH_PROJECT_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: FETCH_PROJECT_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

const fetchAllProjectJobs = (projectId) => {
  return axios
    .get(`${API_URL}/projects/${projectId}/jobs/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* fetchAllProjectJobsSaga(action) {
  try {
    const data = yield call(fetchAllProjectJobs, action.id);
    yield put({
      type: FETCH_ALL_JOBS_SUCCEED,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: FETCH_ALL_JOBS_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

const createJobForProject = (payload) => {
  return axios
    .post(`${API_URL}/jobs/`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* createJobForProjectSaga(action) {
  try {
    const data = yield call(createJobForProject, action.payload);
    yield put({
      type: CREATE_JOB_SUCCEED,
    });
  } catch (error) {
    yield put({
      type: CREATE_JOB_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

const deleteAJob = (jobId) => {
  return axios
    .delete(`${API_URL}/jobs/${jobId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* deleteAJobSaga(action) {
  try {
    yield call(deleteAJob, action.jobId);

    yield put({
      type: DELETE_JOB_SUCCEED,
    });
    if (action.projectId) {
      // refetch project jobs
      yield put({
        type: FETCH_ALL_JOBS,
        id: action.projectId,
      });
    }
  } catch (error) {
    yield put({
      type: DELETE_JOB_FAILED,
      error: error?.response?.data?.message ?? 'Something went wrong!',
    });
  }
}

const cloneJob = (jobId) => {
  return axios
    .post(
      `${API_URL}/jobs/${jobId}/clone`,
      {},
      {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      }
    )
    .then((response) => {
      return response.data;
    });
};
export function* cloneJobSaga(action) {
  try {
    yield call(cloneJob, action.jobId);

    yield put({
      type: CLONE_JOB_SUCCEED,
    });
    if (action.projectId) {
      // refetch project jobs
      yield put({
        type: FETCH_ALL_JOBS,
        id: action.projectId,
      });
    }
    toast.info(`Job cloned successfully.`);
  } catch (error) {
    toast.info(`Job clone failed. ${error?.response?.data?.message}`);
    yield put({
      type: CLONE_JOB_FAILED,
      error: error?.response?.data?.message ?? 'Something went wrong!',
    });
  }
}

const fetchProjectMembers = (projectId) => {
  return axios
    .get(`${API_URL}/projects/${projectId}/teams`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* fetchProjectMembersSaga(action) {
  try {
    const data = yield call(fetchProjectMembers, action.id);
    yield put({
      type: FETCH_ALL_TEAM_MEMBERS_SUCCEED,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: FETCH_ALL_TEAM_MEMBERS_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

const fetchWorkflowById = ({ workflowId }) => {
  return axios
    .get(`${API_URL}/workflows/${workflowId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* fetchWorkflowByIdSaga(action) {
  try {
    const data = yield call(fetchWorkflowById, action);
    yield put({
      type: FETCH_WORKFLOW_BY_ID_SUCCEED,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: FETCH_WORKFLOW_BY_ID_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}

const fetchWorkflowByProject = ({ projectId }) => {
  return axios
    .get(`${API_URL}/workflows/project/${projectId}/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* fetchWorkflowByProjectSaga(action) {
  try {
    const data = yield call(fetchWorkflowByProject, action);
    yield put({
      type: FETCH_WORKFLOW_BY_PROJECT_SUCCEED,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: FETCH_WORKFLOW_BY_PROJECT_FAILED,
      error: error.response ? error.response.data : 'Something went wrong!',
    });
  }
}
const inviteProjectMembers = (payload) => {
  return axios
    .post(`${API_URL}/projects/${payload.projectId}/teams`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* inviteProjectMembersSaga(action) {
  try {
    const data = yield call(inviteProjectMembers, action.data);
    yield put({
      type: INVITE_TEAM_MEMBERS_SUCCEED,
      payload: data,
    });
    // Re-fetch project memebers
    yield put({
      type: FETCH_ALL_TEAM_MEMBERS,
      id: action.data.projectId,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: INVITE_TEAM_MEMBERS_FAILED,
      error: error.response ? error.response?.data?.message : 'Something went wrong!',
    });
  }
}

const removeProjectMember = (payload) => {
  return axios
    .delete(`${API_URL}/projects/${payload.projectId}/teams/${payload.userInvolvementId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* removeProjectMemberSaga(action) {
  try {
    const data = yield call(removeProjectMember, action.data);
    yield put({
      type: REMOVE_TEAM_MEMBER_SUCCEED,
      payload: data,
    });
    // Re-fetch project memebers
    yield put({
      type: FETCH_ALL_TEAM_MEMBERS,
      id: action.data.projectId,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_TEAM_MEMBER_FAILED,
      error: error.response ? error.response?.data?.message : 'Something went wrong!',
    });
  }
}

const updateProjectMember = (userInvolvementId, payload) => {
  return axios
    .patch(`${API_URL}/projects/${payload.projectId}/teams/${userInvolvementId}`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => {
      return response.data;
    });
};
export function* updateProjectMemberSaga(action) {
  try {
    const data = yield call(updateProjectMember, action.id, action.data);
    yield put({
      type: UPDATE_TEAM_MEMBER_SUCCEED,
      payload: data,
    });
    // Re-fetch project memebers
    yield put({
      type: FETCH_ALL_TEAM_MEMBERS,
      id: action.data.projectId,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPDATE_TEAM_MEMBER_FAILED,
      error: error.response ? error.response?.data?.message : 'Something went wrong!',
    });
  }
}

export const projectDetailSaga = [
  takeEvery(FETCH_PROJECT, fetchProjectSaga),
  takeEvery(FETCH_ALL_JOBS, fetchAllProjectJobsSaga),
  takeEvery(DELETE_JOB, deleteAJobSaga),
  takeEvery(CLONE_JOB, cloneJobSaga),
  takeEvery(FETCH_ALL_TEAM_MEMBERS, fetchProjectMembersSaga),
  takeEvery(INVITE_TEAM_MEMBERS, inviteProjectMembersSaga),
  takeEvery(REMOVE_TEAM_MEMBER, removeProjectMemberSaga),
  takeEvery(UPDATE_TEAM_MEMBER, updateProjectMemberSaga),
  takeEvery(FETCH_WORKFLOW_BY_ID, fetchWorkflowByIdSaga),
  takeEvery(FETCH_WORKFLOW_BY_PROJECT, fetchWorkflowByProjectSaga),
];

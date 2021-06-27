import {
  FETCH_PROJECT,
  FETCH_PROJECT_SUCCEED,
  FETCH_PROJECT_FAILED,
  FETCH_ALL_JOBS_SUCCEED,
  FETCH_ALL_JOBS_FAILED,
  DELETE_JOB,
  DELETE_JOB_SUCCEED,
  DELETE_JOB_FAILED,
  FETCH_ALL_TEAM_MEMBERS_SUCCEED,
} from './constant';

const initialState = {
  isFetching: false,
  project: [],
  jobs: [],
  error: {},
  teamMembers: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECT:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_PROJECT_SUCCEED:
      return {
        ...state,
        isFetching: false,
        project: action.payload,
      };
    case FETCH_PROJECT_FAILED:
      return {
        ...state,
        isFetching: false,
      };
    case FETCH_ALL_JOBS_SUCCEED:
      return {
        ...state,
        jobs: action.payload,
      };
    case FETCH_ALL_JOBS_FAILED:
      return {
        ...state,
        jobs: [],
      };
    case DELETE_JOB:
      return {
        ...state,
        isJobDeleted: false,
        error: {
          ...state.error,
          DELETE_JOB: null,
        },
      };
    case DELETE_JOB_SUCCEED:
      return {
        ...state,
        isJobDeleted: true,
        error: {
          ...state.error,
          DELETE_JOB: null,
        },
      };
    case DELETE_JOB_FAILED:
      return {
        ...state,
        isJobDeleted: false,
        error: {
          ...state.error,
          DELETE_JOB: action.error,
        },
      };
    case FETCH_ALL_TEAM_MEMBERS_SUCCEED:
      return {
        ...state,
        teamMembers: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;

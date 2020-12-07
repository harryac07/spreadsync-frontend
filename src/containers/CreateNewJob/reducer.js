import {
  FETCH_PROJECT,
  FETCH_PROJECT_SUCCEED,
  FETCH_PROJECT_FAILED,
  FETCH_ALL_JOBS_SUCCEED,
  FETCH_ALL_JOBS_FAILED,
} from './constant';

const initialState = {
  isFetching: false,
  project: [],
  jobs: [],
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
    default:
      return state;
  }
};
export default reducer;

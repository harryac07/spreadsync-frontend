import {
  FETCH_PROJECTS,
  FETCH_PROJECTS_SUCCEED,
  FETCH_PROJECTS_FAILED,
  CREATE_PROJECT,
  CREATE_PROJECT_SUCCEED,
  CREATE_PROJECT_FAILED,
} from './constant';

const initialState = {
  projects: [],
  fetching: false,
  error: {},
  success: {},
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECTS:
      return {
        ...state,
        fetching: true,
        error: {
          ...state.error,
          [FETCH_PROJECTS]: undefined,
        },
        success: {
          ...state.success,
          [CREATE_PROJECT]: false,
        },
      };
    case FETCH_PROJECTS_SUCCEED:
      return {
        ...state,
        projects: action.payload,
        fetching: false,
      };
    case FETCH_PROJECTS_FAILED:
      return {
        ...state,
        fetching: false,
        error: {
          ...state.error,
          [FETCH_PROJECTS]: action.error,
        },
      };
    case CREATE_PROJECT:
      return {
        ...state,
        error: {
          ...state.error,
          [CREATE_PROJECT]: null,
        },
        success: {
          ...state.success,
          [CREATE_PROJECT]: false,
        },
      };
    case CREATE_PROJECT_SUCCEED:
      return {
        ...state,
        success: {
          ...state.success,
          [CREATE_PROJECT]: true,
        },
      };
    case CREATE_PROJECT_FAILED:
      return {
        ...state,
        error: {
          ...state.error,
          [CREATE_PROJECT]: action.error,
        },
      };
    default:
      return state;
  }
};
export default reducer;

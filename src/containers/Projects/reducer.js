import { FETCH_PROJECTS, FETCH_PROJECTS_SUCCEED, FETCH_PROJECTS_FAILED } from './constant';

const initialState = {
  projects: [],
  fetching: false,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROJECTS:
      return {
        ...state,
        fetching: true,
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
        error: action.error,
      };
    default:
      return state;
  }
};
export default reducer;

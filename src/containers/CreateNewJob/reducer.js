import { CREATE_JOB, CREATE_JOB_SUCCEED, CREATE_JOB_FAILED } from './constant';

const initialState = {
  jobCreated: false
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_JOB:
      return {
        ...state,
        jobCreated: false
      };
    case CREATE_JOB_SUCCEED:
      return {
        ...state,
        jobCreated: true
      };
    case CREATE_JOB_FAILED:
      return {
        ...state,
        jobCreated: false,
        isError: action.payload
      };
    default:
      return state;
  }
};
export default reducer;

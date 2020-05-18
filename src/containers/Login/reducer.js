import { TEST_REQUEST, TEST_REQUEST_SUCCEED, TEST_REQUEST_FAILED } from './constant';

const initialState = {};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TEST_REQUEST:
      return {
        ...state,
      };
    case TEST_REQUEST_SUCCEED:
      return {
        ...state,
      };
    case TEST_REQUEST_FAILED:
      return {
        ...state,
      };
    default:
      return state;
  }
};
export default reducer;

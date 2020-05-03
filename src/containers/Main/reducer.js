import { CHECK_AUTH_REQUEST, CHECK_AUTH_REQUEST_SUCCEED, CHECK_AUTH_REQUEST_FAILED } from './constant';

const initialState = {
  loggedIn: false,
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_AUTH_REQUEST:
      return {
        ...state,
      };
    case CHECK_AUTH_REQUEST_SUCCEED:
      return {
        ...state,
        loggedIn: true,
      };
    case CHECK_AUTH_REQUEST_FAILED:
      return {
        ...state,
        loggedIn: false,
      };
    default:
      return state;
  }
};
export default appReducer;

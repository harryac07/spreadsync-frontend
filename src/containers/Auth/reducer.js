import { SIGNUP, SIGNUP_SUCCEED, SIGNUP_FAILED, LOGIN, LOGIN_SUCCEED, LOGIN_FAILED } from './constant';

const initialState = {
  error: {},
  success: {},
  loading: {},
  currentUser: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP:
      return {
        ...state,
        error: { ...state.error, [SIGNUP]: undefined },
        success: { ...state.success, [SIGNUP]: undefined },
      };
    case SIGNUP_SUCCEED:
      return {
        ...state,
        error: { ...state.error, [SIGNUP]: undefined },
        success: { ...state.success, [SIGNUP]: true },
      };
    case SIGNUP_FAILED:
      return {
        ...state,
        error: { ...state.error, [SIGNUP]: action.error },
        success: { ...state.success, [SIGNUP]: undefined },
      };
    case LOGIN:
      return {
        ...state,
        error: { ...state.error, [LOGIN]: undefined },
        success: { ...state.success, [LOGIN]: undefined },
      };
    case LOGIN_SUCCEED:
      return {
        ...state,
        error: { ...state.error, [LOGIN]: undefined },
        success: { ...state.success, [LOGIN]: true },
        currentUser: action.payload,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        error: { ...state.error, [LOGIN]: action.error },
        success: { ...state.success, [LOGIN]: undefined },
      };
    default:
      return state;
  }
};
export default reducer;

import {
  SIGNUP,
  SIGNUP_SUCCEED,
  SIGNUP_FAILED,
  LOGIN,
  LOGIN_SUCCEED,
  LOGIN_FAILED,
  CONFIRM_EMAIL,
  CONFIRM_EMAIL_FAILED,
} from './constant';

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
    case CONFIRM_EMAIL:
      return {
        ...state,
        error: { ...state.error, [CONFIRM_EMAIL]: undefined },
        // success: { ...state.success, [CONFIRM_EMAIL]: undefined },
      };
    case CONFIRM_EMAIL_FAILED:
      return {
        ...state,
        error: { ...state.error, [CONFIRM_EMAIL]: action.error },
        // success: { ...state.success, [CONFIRM_EMAIL]: undefined },
      };
    default:
      return state;
  }
};
export default reducer;

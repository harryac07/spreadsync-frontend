import { FETCH_ALL_USER_ACCOUNTS, FETCH_ALL_USER_ACCOUNTS_SUCCEED, FETCH_ALL_USER_ACCOUNTS_FAILED } from './constant';

const initialState = {
  fetching: false,
  selectedAccount: '',
  accounts: [],
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_USER_ACCOUNTS:
      return {
        ...state,
        fetching: true,
      };
    case FETCH_ALL_USER_ACCOUNTS_SUCCEED:
      return {
        ...state,
        fetching: false,
        accounts: action.payload,
      };
    case FETCH_ALL_USER_ACCOUNTS_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};
export default appReducer;

import {
  FETCH_ALL_USER_ACCOUNTS,
  FETCH_ALL_USER_ACCOUNTS_SUCCEED,
  FETCH_ALL_USER_ACCOUNTS_FAILED,
  FETCH_CURRENT_USER_BY_ID_SUCCEED,
  SET_SEARCH_KEYWORD,
} from './constant';

const initialState = {
  fetching: false,
  selectedAccount: '',
  accounts: [],
  searchKeyword: '',
  currentUser: [],
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
    case FETCH_CURRENT_USER_BY_ID_SUCCEED:
      return {
        ...state,
        currentUser: action.payload,
      };
    case SET_SEARCH_KEYWORD:
      return {
        ...state,
        searchKeyword: action.data,
      };
    default:
      return state;
  }
};
export default appReducer;

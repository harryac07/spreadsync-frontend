import { CHECK_AUTH_REQUEST, FETCH_CURRENT_USER_BY_ID, FETCH_ALL_USER_ACCOUNTS, SET_SEARCH_KEYWORD } from './constant';

/**
 * checkUserAuth
 * @param {String}userToken - userToken to check user authentication
 */
export const checkUserAuth = (userToken) => {
  return {
    type: CHECK_AUTH_REQUEST,
    token: userToken,
  };
};

/**
 * fetchAllAccountsForUser
 * @param {String}userId
 */
export const fetchAllAccountsForUser = (userId) => {
  return {
    type: FETCH_ALL_USER_ACCOUNTS,
    id: userId,
  };
};

/**
 * fetchCurrentUser
 * @param {String}userId
 */
export const fetchCurrentUser = (userId) => {
  return {
    type: FETCH_CURRENT_USER_BY_ID,
    id: userId,
  };
};

/**
 * setSearchKeyword
 * @param {String}keyword
 */
export const setSearchKeyword = (keyword) => {
  return {
    type: SET_SEARCH_KEYWORD,
    data: keyword,
  };
};

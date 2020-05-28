import { CHECK_AUTH_REQUEST, FETCH_ALL_USER_ACCOUNTS } from './constant';

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

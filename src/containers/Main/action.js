import { CHECK_AUTH_REQUEST } from './constant';

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

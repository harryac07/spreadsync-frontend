import { SIGNUP, LOGIN } from './constant';

/**
 * signup
 * @param {Object}reqPayload
 */
export const signup = (reqPayload) => {
  return {
    type: SIGNUP,
    data: reqPayload,
  };
};

/**
 * login
 * @param {Object}reqPayload
 */
export const login = (reqPayload) => {
  return {
    type: LOGIN,
    data: reqPayload,
  };
};

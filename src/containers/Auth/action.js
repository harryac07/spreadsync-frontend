import { SIGNUP, LOGIN } from './constant';

/**
 * signup
 * @param {Object}reqPayload
 * @param {Object}history - browser history object to push
 */
export const signup = (reqPayload, history) => {
  return {
    type: SIGNUP,
    data: reqPayload,
    history,
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

import { SIGNUP, LOGIN } from './constant';

/**
 * signup
 * @param {Object}reqPayload
 * @param {Object}extraObj - extra data pass to saga
 * @param {String}extraObj.token - invitation token if any
 * @param {Object}extraObj.hisotry - browser extraObj object to push
 */
export const signup = (reqPayload, extraObj) => {
  return {
    type: SIGNUP,
    data: reqPayload,
    extra: extraObj,
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

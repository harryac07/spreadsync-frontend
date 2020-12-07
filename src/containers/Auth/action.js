import { SIGNUP, LOGIN, CONFIRM_EMAIL } from './constant';

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
export const login = (reqPayload, auth = 'username/password') => {
  return {
    type: LOGIN,
    data: reqPayload,
    auth: auth,
  };
};

/**
 * confirmEmail
 * @param {String}email
 */
export const confirmEmail = (email) => {
  return {
    type: CONFIRM_EMAIL,
    data: email,
  };
};

import { CREATE_JOB_SUCCEED, CREATE_JOB_FAILED, UPDATE_JOB_SUCCEED } from './constant';

/**
 * createJobSucceed
 * @param {Object}payload - response payload
 */
export const createJobSucceed = payload => {
  return {
    type: CREATE_JOB_SUCCEED,
    payload
  };
};

/**
 * createJobFailed
 * @param {Object}payload - req payload
 */
export const createJobFailed = payload => {
  return {
    type: CREATE_JOB_FAILED,
    payload
  };
};

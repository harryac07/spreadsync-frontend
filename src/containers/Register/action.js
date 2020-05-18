import { TEST_REQUEST } from './constant';

/**
 * test
 * @param {String}paramStr - some params
 */
export const test = (paramStr) => {
  return {
    type: TEST_REQUEST,
    data: paramStr,
  };
};

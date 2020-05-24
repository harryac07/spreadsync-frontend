import { FETCH_PROJECTS, CREATE_PROJECT } from './constant';

/**
 * fetchProjects
 */
export const fetchProjects = () => {
  return {
    type: FETCH_PROJECTS,
  };
};

/**
 * createProject
 * @param {Object}payload - data to be created
 */
export const createProject = (payload) => {
  return {
    type: CREATE_PROJECT,
    data: payload,
  };
};

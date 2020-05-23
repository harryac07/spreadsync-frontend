import { FETCH_PROJECT, FETCH_ALL_JOBS } from './constant';

/**
 * fetchProjectById
 * @param {String}projectId - some params
 */
export const fetchProjectById = (projectId) => {
  return {
    type: FETCH_PROJECT,
    id: projectId,
  };
};

/**
 * fetchAllJobsForProject
 * @param {String}projectId - some params
 */
export const fetchAllJobsForProject = (projectId) => {
  return {
    type: FETCH_ALL_JOBS,
    id: projectId,
  };
};

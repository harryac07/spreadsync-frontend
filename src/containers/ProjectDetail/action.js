import { FETCH_PROJECT, FETCH_ALL_JOBS, DELETE_JOB, FETCH_ALL_TEAM_MEMBERS } from './constant';

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

/**
 * deleteAJobByJobId
 * @param {String}jobId - Job id to delete
 * @param {String}projectId - projectId of the job
 */
export const deleteAJobByJobId = (jobId, projectId) => {
  return {
    type: DELETE_JOB,
    jobId,
    projectId,
  };
};

/**
 * fetchAllProjectMembers
 * @param {String}projectId - some params
 */
export const fetchAllProjectMembers = (projectId) => {
  return {
    type: FETCH_ALL_TEAM_MEMBERS,
    id: projectId,
  };
};

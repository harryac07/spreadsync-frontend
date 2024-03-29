import {
  FETCH_PROJECT,
  FETCH_ALL_JOBS,
  DELETE_JOB,
  CLONE_JOB,
  FETCH_ALL_TEAM_MEMBERS,
  INVITE_TEAM_MEMBERS,
  REMOVE_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER,
  FETCH_WORKFLOW_BY_ID,
  FETCH_WORKFLOW_BY_PROJECT,
  CREATE_WORKFLOW_FOR_PROJECT,
} from './constant';

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
 * cloneJobById
 * @param {String}jobId - Job id to delete
 * @param {String}projectId - projectId of the job
 */
export const cloneJobById = (jobId, projectId) => {
  console.log('cloneJobById');
  return {
    type: CLONE_JOB,
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
/**
 * fetchWorkflowById
 * @param {String}projectId - project id
 * @param {String}workflowId - workflow id
 */
export const fetchWorkflowById = (projectId, workflowId) => {
  return {
    type: FETCH_WORKFLOW_BY_ID,
    projectId: projectId,
    workflowId: workflowId,
  };
};
/**
 * fetchWorkflowByProject
 * @param {String}projectId - project id
 */
export const fetchWorkflowByProject = (projectId) => {
  return {
    type: FETCH_WORKFLOW_BY_PROJECT,
    projectId: projectId,
  };
};
/**
 * createWorkflowForProject
 * @param {Object}payload - payload to create workflow for project
 * @param {Object}history - browser history object to navigate
 */
export const createWorkflowForProject = (payload, history) => {
  return {
    type: CREATE_WORKFLOW_FOR_PROJECT,
    data: payload,
    history: history,
  };
};
/**
 * inviteProjectMembers
 * @param {Object}payload - req payload for inviting users
 * @param {String}payload.accountId - current account id
 * @param {String}payload.projectId - current project id
 * @param {String}payload.projectName - current project name
 * @param {Object}payload.invitedUsers - List of users and permissions
 */
export const inviteProjectMembers = (payload) => {
  return {
    type: INVITE_TEAM_MEMBERS,
    data: payload,
  };
};

/**
 * removeProjectMember
 * @param {Object}payload - req payload for removing user from the project
 * @param {String}payload.projectId - current project id
 * @param {String}payload.userInvolvementId - user involvement id
 */
export const removeProjectMember = (payload) => {
  return {
    type: REMOVE_TEAM_MEMBER,
    data: payload,
  };
};

/**
 * updateProjectMember
 * @param {String}userInvolvementId - user involvement id
 * @param {Object}payload - payload for updating user permisssion for the project
 * @param {String}payload.permission - project permissions for the project member
 * @param {String}payload.projectId - current project id
 */
export const updateProjectMember = (userInvolvementId, payload) => {
  return {
    type: UPDATE_TEAM_MEMBER,
    data: payload,
    id: userInvolvementId,
  };
};

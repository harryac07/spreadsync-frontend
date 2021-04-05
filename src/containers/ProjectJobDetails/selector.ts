import { createSelector } from 'reselect';

const getProjects = (state) => state?.projectDetail?.project ?? [];

export const selectAllJobsByProject = createSelector(
  getProjects, (projects) => {
    console.log('projects ', projects);
    return true;
  }
)
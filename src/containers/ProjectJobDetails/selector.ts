import { createSelector } from 'reselect';

const getProjects = (state) => state?.projectDetail?.project ?? [];

export const selectAllJobsByProject = createSelector(
  getProjects, (projects) => {
    return true;
  }
)
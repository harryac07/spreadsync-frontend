import { createSelector } from 'reselect';

const getTeamMembers = (state) => state?.projectDetail?.teamMembers ?? [];

export const getPermissionsForCurrentProject = createSelector(
  getTeamMembers, (teamMembers) => {
    const permissions =
      teamMembers?.find(({ user }) => {
        return user === localStorage.getItem('user_id');
      }) || {};
    return permissions?.project_permission ?? '';
  }
)
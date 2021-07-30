import { createSelector } from 'reselect';

const getTeamMembers = (state) => state?.projectDetail?.teamMembers ?? [];

const getAccountPermissions = (state) => {
  const currentAccount = state.app.accounts?.find(({ id }) => id === localStorage.getItem('account_id'));
  const isAccountAdmin = currentAccount?.admin === localStorage.getItem('user_id');
  return isAccountAdmin;
};

export const getPermissionsForCurrentProject = createSelector(
  getTeamMembers, getAccountPermissions, (teamMembers, isAccountAdmin) => {
    if (isAccountAdmin) {
      return 'admin'
    }
    const permissions =
      teamMembers?.find(({ user }) => {
        return user === localStorage.getItem('user_id');
      }) || {};
    return permissions?.project_permission ?? '';
  }
)
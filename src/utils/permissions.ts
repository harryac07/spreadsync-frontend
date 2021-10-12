export const permissions = [
  {
    label: 'Project Admin',
    value: 'admin',
    description: 'Admin of the project. Has all rights under the project.'
  },
  {
    label: 'Project read',
    value: 'project_read',
    description: 'Read project including all jobs. This permission must be provided for the user to be able to view the project.'
  },
  {
    label: 'Project write',
    value: 'project_write',
    description: 'Create and update the project.'
  },
  {
    label: 'Project delete',
    value: 'project_delete',
    description: 'Delete the project.'
  },
  {
    label: 'Job read',
    value: 'job_read',
    description: 'Read only permission on all jobs under the project.'
  },
  {
    label: 'Job write',
    value: 'job_write',
    description: 'Create and update jobs under the project.'
  },
  {
    label: 'Job delete',
    value: 'job_delete',
    description: 'Delete jobs under the project.'
  },
  {
    label: 'Job all',
    value: 'job_all',
    description: 'All permissions related to jobs (READ, WRITE AND CREATE) under the project.'
  },
  {
    label: 'User read',
    value: 'user_read',
    description: 'Read only permission on all team members under the project.'
  },
  {
    label: 'User write',
    value: 'user_write',
    description: 'Invite and update team members under the project.'
  },
  {
    label: 'User delete',
    value: 'user_delete',
    description: 'Remove user or team members from the project.'
  },
  {
    label: 'User all',
    value: 'user_all',
    description: 'All permissions related to team members inside the project.'
  },
]

/*  Need to re-think about the roles later. Just a placeholder for now. */
export const roles = [
  {
    label: 'Admin',
    value: 'Admin',
    description: 'Admin'
  },
  {
    label: 'Developer',
    value: 'Developer',
    description: 'Developer'
  },
  {
    label: 'Sales',
    value: 'Sales',
    description: 'Sales'
  },
  {
    label: 'Guest',
    value: 'Guest',
    description: 'Guest'
  },
];

export const roleBasedDefaultPermissions = [
  {
    role: 'Admin',
    permissions: ['admin'],
  },
  {
    role: 'Developer',
    permissions: ['project_read', 'project_write', 'job_all', 'user_all'],
  },
  {
    role: 'Sales',
    permissions: ['project_read', 'job_read', 'user_all']
  },
  {
    role: 'Guest',
    permissions: ['project_read'],
  },
]
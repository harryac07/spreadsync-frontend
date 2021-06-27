export const permissions = [
  {
    label: 'Project read',
    value: 'project_read',
    description: 'Read project including all jobs'
  },
  {
    label: 'Project write',
    value: 'project_write',
    description: 'Create and update projects'
  },
  {
    label: 'Project delete',
    value: 'project_delete',
    description: 'Delete projects'
  },
  {
    label: 'Project all',
    value: 'project_all',
    description: 'All permission to project (CRUD) including jobs'
  },
  {
    label: 'Job read',
    value: 'job_read',
    description: 'Read only permission on all jobs under the project.'
  },
  {
    label: 'Job write',
    value: 'job_write',
    description: 'Create and update jobs'
  },
  {
    label: 'Job delete',
    value: 'job_delete',
    description: 'Delete jobs'
  },
  {
    label: 'Job all',
    value: 'job_all',
    description: 'All permissions related to jobs (CRUD)'
  },
  // {
  //   label: 'User read',
  //   value: 'user_read',
  //   description: 'Read only permission on all team members under the project.'
  // },
  {
    label: 'User write',
    value: 'user_write',
    description: 'Invite and update team member permissions'
  },
  {
    label: 'User delete',
    value: 'user_delete',
    description: 'Remove user or team members from the project'
  },
  {
    label: 'User all',
    value: 'user_all',
    description: 'All permissions related to team members inside the project'
  },
  {
    label: 'Project Admin',
    value: 'admin',
    description: 'Admin of the project. Has all rights under the project'
  },
]

/*  Need to re-think about the roles later. Just a placeholder for now. */
export const roles = [
  {
    label: 'Admin',
    value: 'admin',
    description: 'Admin'
  },
  {
    label: 'Developer',
    value: 'developer',
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
]
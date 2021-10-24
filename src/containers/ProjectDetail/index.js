import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { startCase, toLower, intersection } from 'lodash';
import Button from 'components/common/Button';
import ConfirmDialog from 'components/common/ConfirmDialog';
import {
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableHead,
  Chip,
  Grid,
  Tabs,
  Tab,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  fetchProjectById,
  fetchAllJobsForProject,
  cloneJobById,
  deleteAJobByJobId,
  fetchAllProjectMembers,
  fetchWorkflowByProject,
  inviteProjectMembers,
  removeProjectMember,
  updateProjectMember,
} from './action';

import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloneIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import WarningIcon from '@material-ui/icons/Warning';

import Tooltip from '../../components/common/Tooltip';
import InviteUsersWithPermissions from './Components/InviteUsersWithPermissions';
import ProjectSetting from './Components/ProjectSetting';
import Workflow from './Components/Workflow';
import { permissions, roleBasedDefaultPermissions } from '../../utils/permissions';
import { getPermissionsForCurrentProject } from 'store/selectors';
import ContainerWithHeader from 'components/ContainerWithHeader';
import TableWithPagination from 'components/common/TableWithPagination';

class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'job', // job or setting or newjob
      newJobInput: {},
      currentTab: 0,
    };
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchProjectById(id);
    this.props.fetchAllJobsForProject(id);
    this.props.fetchAllProjectMembers(id);
    this.props.fetchWorkflowByProject(id);
  }
  componentDidUpdate(prevProps, prevState) {
    const store = this.props.projectDetail;
    const {
      error: {
        DELETE_JOB: currentDeleteJobError,
        INVITE_TEAM_MEMBERS: currentUserInviteError,
        REMOVE_TEAM_MEMBER: currentUserRemoveError,
        UPDATE_TEAM_MEMBER: currentUserUpdateError,
      },
      isJobDeleted,
      isUserInvited,
      isUserRemoved,
      isUserUpdated,
    } = store;
    const {
      error: {
        DELETE_JOB: prevDeleteJobError,
        INVITE_TEAM_MEMBERS: prevUserInviteError,
        REMOVE_TEAM_MEMBER: prevUserRemoveError,
        UPDATE_TEAM_MEMBER: prevUserUpdateError,
      },
      isJobDeleted: prevIsJobDeleted,
      isUserInvited: prevIsUserInvited,
      isUserRemoved: prevIsUserRemoved,
      isUserUpdated: prevIsUserUpdated,
    } = prevProps.projectDetail;
    if (currentDeleteJobError !== prevDeleteJobError && currentDeleteJobError) {
      toast.error(`${currentDeleteJobError}`);
    }

    if (currentUserInviteError !== prevUserInviteError && currentUserInviteError) {
      toast.error(`${currentUserInviteError}`);
    }

    if (currentUserRemoveError !== prevUserRemoveError && currentUserRemoveError) {
      toast.error(`${currentUserRemoveError}`);
    }
    if (currentUserUpdateError !== prevUserUpdateError && currentUserUpdateError) {
      toast.error(`${currentUserUpdateError}`);
    }

    if (isJobDeleted !== prevIsJobDeleted && isJobDeleted) {
      toast.success(`Job deleted successfully!`);
    }

    if (isUserInvited !== prevIsUserInvited && isUserInvited) {
      toast.success(`User invited successfully!`);
    }
    if (isUserRemoved !== prevIsUserRemoved && isUserRemoved) {
      toast.success(`User removed successfully!`);
    }
    if (isUserUpdated !== prevIsUserUpdated && isUserUpdated) {
      toast.success(`Project team member updated successfully!`);
    }
  }
  updateCurrentView = (selectedView = 'job') => {
    this.setState({ currentView: selectedView });
  };
  createNewJob = (payload) => {
    console.log(payload);
  };
  submitNewJobChange = (name, value) => {
    this.setState({
      newJobInput: {
        ...this.state.newJobInput,
        [name]: value,
      },
    });
  };
  inviteUsersToTheProject = (userList = []) => {
    const projectId = this.props?.match?.params?.id;
    const projectName = this.props?.projectDetail?.project?.find(({ id }) => id === projectId)?.name;
    const accountId = localStorage?.getItem('account_id');
    if (accountId && projectId) {
      const payload = {
        accountId,
        projectId,
        projectName,
        invitedUsers: userList,
      };
      this.props.inviteProjectMembers(payload);
    }
  };
  removeUserFromTheProject = (userInvolvementId) => {
    this.props.removeProjectMember({
      projectId: this.props?.match?.params?.id,
      userInvolvementId,
    });
  };
  updateProjectMemberPermission = (userInvolvementId, data) => {
    const projectId = this.props?.match?.params?.id;
    const { permission, role } = data[0];

    const payload = {
      permission,
      role,
      projectId,
    };
    this.props.updateProjectMember(userInvolvementId, payload);
  };

  hasPermission = (permissionToCheck) => {
    const { projectPermissions = '', isAccountAdmin = false } = this.props;
    if (isAccountAdmin || projectPermissions.includes('admin')) {
      return true;
    }

    if (typeof permissionToCheck === 'string') {
      return projectPermissions.includes(permissionToCheck);
    } else {
      const permissionFound = intersection(permissionToCheck, projectPermissions?.split(','));
      return !!permissionFound?.length;
    }
  };
  renderJobs = () => {
    const { classes, searchKeyword, projectDetail, deleteAJobByJobId, cloneJobById } = this.props;
    const { jobs } = projectDetail;
    const projectId = this.props?.match?.params?.id ?? '';

    const filteredJobs = jobs.filter(({ name, description }) => {
      if (searchKeyword) {
        return toLower(name).includes(searchKeyword) || toLower(description).includes(searchKeyword);
      }
      return true;
    });

    if (!this.hasPermission(['project_all', 'project_read'])) {
      return (
        <div className={classes.noJobWrapper}>
          <div>
            <p>Access denied! Please contact the admin of this project for the access.</p>
          </div>
        </div>
      );
    }

    if (filteredJobs.length === 0) {
      return (
        <div className={classes.noJobWrapper}>
          <div>
            <p>Jobs not found.</p>
          </div>
        </div>
      );
    }
    return (
      <TableWithPagination
        primaryKey="id"
        headers={['Job Name', 'Description', 'Type', 'Created By', '']}
        options={filteredJobs?.map((each) => {
          return {
            id: each.id,
            name: (
              <Link to={`/projects/${projectId}/job/${each.id}`} className={classes.jobName}>
                {each.name}
              </Link>
            ),
            description: each.description,
            type: each.type,
            user_email: each.user_email,
            '': (
              <>
                {this.hasPermission(['job_all', 'job_write']) && (
                  <ConfirmDialog
                    ctaToOpenModal={
                      <CloneIcon fontSize="small" style={{ fontSize: 18, cursor: 'pointer', color: 'black' }} />
                    }
                    header={
                      <span>
                        Clone the job: <u>{each.name}</u>?
                      </span>
                    }
                    bodyContent={
                      'Cloning the job makes exact replica of the selected job coyping the configuration and data source aand target setups. This feature helps you to save time creating similar job that exists already. '
                    }
                    cancelText="Cancel"
                    cancelCallback={() => null}
                    confirmText="Clone"
                    confirmCallback={() => cloneJobById(each.id, projectId)}
                  />
                )}
                {this.hasPermission(['job_all', 'job_delete']) && (
                  <ConfirmDialog
                    ctaToOpenModal={
                      <DeleteIcon fontSize="small" style={{ fontSize: 18, cursor: 'pointer', color: 'red' }} />
                    }
                    header={
                      <span>
                        Confirm deleting the job: <u>{each.name}</u>?
                      </span>
                    }
                    bodyContent={
                      'Deleting the job deletes everything connected to the job and you can not undone this later. This action deletes the job history, configured data source and target'
                    }
                    cancelText="Cancel"
                    cancelCallback={() => null}
                    confirmText="Confirm"
                    confirmCallback={() => deleteAJobByJobId(each.id, projectId)}
                  />
                )}
              </>
            ),
          };
        })}
      />
    );
  };

  renderProjectMembers = () => {
    const { classes, projectDetail } = this.props;
    const { teamMembers = [] } = projectDetail || {};
    const isCurrentUserProjectAdmin = teamMembers.some(({ user, project_permission }) => {
      return toLower(project_permission).includes('admin') && user === localStorage.getItem('user_id');
    });
    return (
      <Paper elevation={3} className={classes.contentWrapper}>
        <HeaderText className={classes.HeaderText} padding="20px" fontsize={'18px'}>
          Team Members ({teamMembers?.length})
          {this.hasPermission(['user_all', 'user_write']) && (
            <div style={{ textAlign: 'right', display: 'inline-block', position: 'absolute', right: 52 }}>
              <InviteUsersWithPermissions
                onSubmit={(data) => this.inviteUsersToTheProject(data)}
                onModalClose={() => null}
                forceClose={this.props.projectDetail.isUserInvited}
                defaultValue={{
                  email: '',
                  role: '',
                  permission: [],
                }}
              />
            </div>
          )}
        </HeaderText>
        <Divider light className={classes.dividers} />

        <div className={classes.content}>
          {this.hasPermission(['project_all', 'project_read']) ? (
            <div>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Is project admin?</TableCell>
                    <TableCell>Role</TableCell>
                    {isCurrentUserProjectAdmin && <TableCell>Permissions</TableCell>}
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((row) => {
                    const isAdmin = toLower(row.project_permission).includes('admin');
                    const projectPermissions = row.project_permission ? row.project_permission?.split(',') : [];
                    const projectRole = row.project_role ?? '';
                    return (
                      <TableRow hover key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.email}
                        </TableCell>
                        <TableCell>{isAdmin ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          {projectRole}
                          {isCustomizedPermission(projectRole, projectPermissions) && (
                            <Tooltip
                              arrow
                              placement="top"
                              title={
                                'Role is not into action. Permission is customized for the user. To use role based permission, unselect all permissions, save the changes and try to change to the correct Role.'
                              }
                            >
                              <WarningIcon fontSize="small" className={classes.permissionWarning} />
                            </Tooltip>
                          )}
                        </TableCell>
                        {isCurrentUserProjectAdmin && (
                          <TableCell>
                            {projectPermissions?.map((each) => {
                              const formattedPermission = startCase(each).replace(/_/g, ' ');
                              const permissionObj = permissions.find(({ value }) => value === each);
                              if (!permissionObj?.description) {
                                return 'N/A';
                              }
                              return (
                                <Tooltip arrow placement="top" title={permissionObj.description} key={each}>
                                  <Chip
                                    size="small"
                                    label={formattedPermission}
                                    className={classes.chipLabel}
                                    color="secondary"
                                  />
                                </Tooltip>
                              );
                            })}
                          </TableCell>
                        )}
                        <TableCell>
                          {this.hasPermission(['user_all', 'user_delete']) && (
                            <ConfirmDialog
                              ctaToOpenModal={
                                <DeleteIcon
                                  fontSize="small"
                                  style={{ color: 'red', marginRight: 8 }}
                                  className={classes.teamCtaIcon}
                                />
                              }
                              header={<span>Confirm removing project member?</span>}
                              bodyContent={
                                'Removing the users from the project removes all permissions and prevents user from accessing the project.'
                              }
                              cancelText="Cancel"
                              cancelCallback={() => null}
                              confirmText="Confirm"
                              confirmCallback={() => this.removeUserFromTheProject(row.id)}
                            />
                          )}
                          {this.hasPermission(['user_all', 'user_write']) && (
                            <InviteUsersWithPermissions
                              onSubmit={(data) => this.updateProjectMemberPermission(row.id, data)}
                              onModalClose={() => null}
                              forceClose={this.props.projectDetail.isUserUpdated}
                              defaultValue={{
                                email: row.email,
                                permission: projectPermissions,
                                role: projectRole,
                              }}
                              ctaButton={<EditIcon fontSize="small" className={classes.teamCtaIcon} />}
                              style={{ display: 'inline-block' }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div>Access denied! Please contact the admin of this project for the access.</div>
          )}
        </div>
      </Paper>
    );
  };
  handleTabChange = (event, newValue) => {
    event.preventDefault();
    this.setState({ currentTab: newValue });
  };
  render() {
    const { classes, projectDetail, history } = this.props;

    const { project, jobs = [], workflows = [] } = projectDetail;
    const { currentView, currentTab } = this.state;

    const { id, name, total_members } = project[0] || {};
    const projectName = startCase(toLower(name));

    return (
      <div className={classes.projectWrapper}>
        <div className={classes.headerWrapper}>
          <HeaderText className={classes.HeaderText} display="inline-block">
            {projectName}
          </HeaderText>
          <div className={classes.userGroup}>
            <GroupIcon fontSize={'small'} />
            <span className={classes.userCount}>{total_members || 0}</span>
          </div>
          <div className={classes.rightColHeading}>
            <div className={classes.headerIconWrapper}>
              {currentView === 'job' ? (
                <SettingsIcon color={'primary'} fontSize={'medium'} onClick={() => this.updateCurrentView('setting')} />
              ) : (
                <CancelIcon color={'error'} fontSize={'medium'} onClick={() => this.updateCurrentView('job')} />
              )}
            </div>
          </div>
        </div>

        {/* Setting view */}
        {currentView === 'setting' && (
          <div>
            <ProjectSetting project={project?.[0]} />
          </div>
        )}
        <div className={classes.contentWrapper}>
          {/* Job list view */}
          {currentView === 'job' ? (
            <React.Fragment>
              <Paper square={true} style={{ marginBottom: 8 }}>
                <Tabs value={currentTab} indicatorColor="primary" textColor="primary" onChange={this.handleTabChange}>
                  <Tab
                    className={classes.tab}
                    label={<ContainerWithHeader headerRightContent={null} headerLeftContent={<>Jobs</>} />}
                  />
                  <Tab label={<ContainerWithHeader headerRightContent={null} headerLeftContent={<>Workflows</>} />} />
                </Tabs>
              </Paper>
              {currentTab === 0 && (
                <ContainerWithHeader
                  padding={20}
                  elevation={1}
                  headerLeftContent={<>Total jobs ({jobs.length})</>}
                  headerRightContent={
                    <>
                      {this.hasPermission(['job_all', 'job_write']) && (
                        <Button
                          startIcon={<AddIcon className={classes.iconSmall} />}
                          size="xs"
                          onClick={() => {
                            localStorage.setItem('current_project', this.props.match.params.id);
                            localStorage.removeItem('new_job_object');
                            history.push(`job/new`);
                          }}
                        >
                          Create job
                        </Button>
                      )}
                    </>
                  }
                  square={true}
                >
                  {/* Jobs view */}
                  {this.renderJobs()}
                </ContainerWithHeader>
              )}
              {currentTab === 1 && (
                <ContainerWithHeader
                  padding={20}
                  elevation={1}
                  headerLeftContent={<>Total Workflows ({workflows.length})</>}
                  headerRightContent={
                    <>
                      {this.hasPermission(['job_all', 'job_write']) && (
                        <Button
                          startIcon={<AddIcon className={classes.iconSmall} />}
                          size="xs"
                          onClick={() => {
                            history.push(`/projects/${id}/workflow/new`);
                          }}
                        >
                          Create workflow
                        </Button>
                      )}
                    </>
                  }
                  square={true}
                >
                  {/* Workflow table view */}
                  <TableWithPagination
                    primaryKey="id"
                    headers={['Name', 'Jobs Count', 'Created By']}
                    options={workflows?.map(({ id, name, project, workflow, created_by }) => {
                      const totalJobsInWorkflows = workflow?.reduce((prev, currentWorkflow) => {
                        return [...prev, ...currentWorkflow?.values];
                      }, []);
                      return {
                        id: id,
                        name: (
                          <Link to={`/projects/${project}/workflow/${id}`} className={classes.jobName}>
                            {name}
                          </Link>
                        ),
                        count: totalJobsInWorkflows?.length,
                        created_by: created_by,
                      };
                    })}
                  />
                </ContainerWithHeader>
              )}
            </React.Fragment>
          ) : null}
        </div>
        {/* Team members view */}
        {currentView === 'job' && this.renderProjectMembers()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projectDetail: state.projectDetail,
    projectPermissions: getPermissionsForCurrentProject(state),
    account: state.app.accounts,
    searchKeyword: state.app.searchKeyword,
  };
};

const styles = (theme) => ({
  projectWrapper: {
    border: 0,
    borderRadius: 3,
    color: '#000',
    margin: '0 auto',
    position: 'relative',
    marginBottom: 0,
  },
  HeaderText: {},
  userGroup: {
    display: 'inline-block',
    right: 20,
    verticalAlign: 'middle',
    marginLeft: 20,
  },
  headerWrapper: {
    backgroundColor: '#fff',
    padding: '5px 32px 5px 32px',
    boxShadow: '0px 0px 1px 0px #888888',
  },
  rightColHeading: {
    display: 'inline-block',
    position: 'absolute',
    right: 28,
    '& button': {
      display: 'inline-block',
      height: 30,
      fontSize: 13,
      textTransform: 'none',
      top: -14,
      marginRight: 10,
    },
    '& svg': {
      position: 'relative',
      top: 3,
      cursor: 'pointer',
    },
  },
  iconSmall: {
    height: 20,
  },
  userCount: {
    verticalAlign: 'middle',
    position: 'relative',
    top: -6,
    paddingLeft: 5,
    fontWeight: 500,
  },
  projectDescription: {
    fontSize: 14,
    background: '#eee',
    padding: 20,
    borderRadius: '10px',
    margin: '0px 20px 10px 20px',
  },
  divider: {
    margin: '10px auto',
  },
  createButton: {
    display: 'inline-block',
    textTransform: 'none',
  },
  noJobWrapper: {
    textAlign: 'left',
    margin: '0px auto',
    backgroundColor: '#fff',
  },
  contentWrapper: {
    margin: 32,
  },
  content: {
    padding: 20,
  },
  table: {
    border: '1px solid #eee',
  },
  jobName: { fontSize: 16, textDecoration: 'none', color: '#3A3C67', fontWeight: 500 },
  chipLabel: {
    fontSize: 11,
    marginRight: 5,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
  },
  teamCtaIcon: { fontSize: 18, cursor: 'pointer' },
  permissionWarning: {
    position: 'absolute',
    padding: 5,
    color: '#ffc107',
    margin: '-1px -3px',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
});

export default connect(mapStateToProps, {
  fetchProjectById,
  fetchAllJobsForProject,
  deleteAJobByJobId,
  cloneJobById,
  fetchAllProjectMembers,
  fetchWorkflowByProject,
  inviteProjectMembers,
  removeProjectMember,
  updateProjectMember,
})(withStyles(styles)(ProjectDetail));

const isCustomizedPermission = (userRole, userPermissions = []) => {
  const neededPermissions = roleBasedDefaultPermissions?.find(({ role }) => role === userRole)?.permissions;
  return intersection(neededPermissions, userPermissions)?.length !== userPermissions?.length;
};

export const HeaderText = styled.div`
  font-weight: bold;
  font-size: ${(props) => (props.fontsize ? props.fontsize : '22px')};
  display: ${(props) => (props.display ? props.display : 'flex')};
  align-items: center;
  justify-content: flex-start;
  padding: ${(props) => (props.padding ? props.padding : '0px')};
`;

export const NewJobRightbarWrapper = styled.div`
  margin: 10px auto;
  margin-bottom: 15px;
  padding: 10px 30px;
  line-height: normal;

  div > p.key {
    color: #000;
    font-weight: bold;
    margin: 15px 0px 0px 0px;
  }
  div > p.value {
    color: #606060;
    font-weight: normal;
    margin: 0px;
  }
`;

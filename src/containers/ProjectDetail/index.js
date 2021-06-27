import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { startCase, toLower } from 'lodash';
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
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { fetchProjectById, fetchAllJobsForProject, deleteAJobByJobId, fetchAllProjectMembers } from './action';

import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'job', // job or setting or newjob
      newJobInput: {},
      page: 0,
      rowsPerPage: 10,
    };
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchProjectById(id);
    this.props.fetchAllJobsForProject(id);
    this.props.fetchAllProjectMembers(id);
  }
  componentDidUpdate(prevProps, prevState) {
    const store = this.props.projectDetail;
    const {
      error: { DELETE_JOB: currentDeleteJobError },
      isJobDeleted,
    } = store;
    const {
      error: { DELETE_JOB: prevDeleteJobError },
      isJobDeleted: prevIsJobDeleted,
    } = prevProps.projectDetail;
    if (currentDeleteJobError !== prevDeleteJobError && currentDeleteJobError) {
      toast.error(`${currentDeleteJobError}`);
    }
    if (isJobDeleted !== prevIsJobDeleted && isJobDeleted) {
      toast.success(`Job deleted successfully!`);
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
  renderJobs = () => {
    const { classes, projectDetail, deleteAJobByJobId } = this.props;
    const { jobs } = projectDetail;
    const projectId = this.props?.match?.params?.id ?? '';
    const { rowsPerPage, page } = this.state;

    if (jobs.length === 0) {
      return (
        <div className={classes.noJobWrapper}>
          <div>
            <p>Jobs not available.</p>
          </div>
        </div>
      );
    }
    return (
      <div>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Job Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0 ? jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : jobs).map(
                (row) => (
                  <TableRow hover key={row.id}>
                    <TableCell component="th" scope="row">
                      <Link to={`/projects/${projectId}/job/${row.id}`} className={classes.jobName}>
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.user_email}</TableCell>
                    <TableCell>
                      <ConfirmDialog
                        ctaToOpenModal={
                          <DeleteIcon fontSize="small" style={{ fontSize: 18, cursor: 'pointer', color: 'red' }} />
                        }
                        header={
                          <span>
                            Confirm deleting the job: <u>{row.name}</u>?
                          </span>
                        }
                        bodyContent={
                          'Deleting the job deletes everything connected to the job and you can not undone this later. This action deletes the job history, configured data source and target'
                        }
                        cancelText="Cancel"
                        cancelCallback={() => null}
                        confirmText="Confirm"
                        confirmCallback={() => deleteAJobByJobId(row.id, projectId)}
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {jobs.length > rowsPerPage && (
          <TablePagination
            rowsPerPageOptions={[10, 20, jobs.length]}
            component="div"
            count={jobs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={(e, page) => this.setState({ page })}
            onChangeRowsPerPage={(e) => {
              const selectedRowsPerPage = parseInt(e.target.value);
              if (jobs.length >= selectedRowsPerPage * page) {
                this.setState({ rowsPerPage: selectedRowsPerPage });
              }
            }}
            classes={{
              caption: classes.caption,
              selectIcon: classes.paginationSelectIcon,
              select: classes.paginationSelect,
            }}
            backIconButtonProps={{
              size: 'small',
            }}
            nextIconButtonProps={{
              size: 'small',
            }}
          />
        )}
      </div>
    );
  };
  renderProjectSetting = () => {
    const { classes } = this.props;
    return (
      <div>
        Project setting view.
        <Divider className={classes.divider} light />
        <p>Initial ideas: </p>
        <ul>
          <li>update and delete projects</li>
          <li>Invite members to the projects</li>
          <li>Delete project members</li>
          <li>Update role of each member of the project</li>
        </ul>
      </div>
    );
  };
  renderProjectMembers = () => {
    const { classes, projectDetail } = this.props;
    const { teamMembers = [] } = projectDetail || {};
    return (
      <Paper elevation={3} className={classes.contentWrapper}>
        <HeaderText className={classes.HeaderText} padding="20px" fontsize={'18px'}>
          Team Members ({teamMembers?.length})
          <div style={{ textAlign: 'right', display: 'inline-block', position: 'absolute', right: 52 }}>
            <Button startIcon={<GroupAddIcon className={classes.iconSmall} color="white" />} size="xs">
              Invite user
            </Button>
          </div>
        </HeaderText>
        <Divider light className={classes.dividers} />

        <div className={classes.content}>
          <div>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Is project admin?</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamMembers.map((row) => {
                  return (
                    <TableRow hover key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.email}
                      </TableCell>
                      <TableCell>{row.permission_name === 'admin' ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{row.permission_name || 'N/A'}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </Paper>
    );
  };
  render() {
    const { classes, projectDetail, history } = this.props;

    const { project, jobs = [] } = projectDetail;
    const { currentView } = this.state;

    const { name, total_members } = project[0] || {};
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
        {currentView === 'setting' ? <div>{this.renderProjectSetting()}</div> : null}

        {/* Job list view */}
        {currentView === 'job' ? (
          <React.Fragment>
            {/* Jobs view */}
            <Paper elevation={3} className={classes.contentWrapper}>
              <HeaderText className={classes.HeaderText} fontsize={'18px'} padding="20px" display="inline-block">
                Jobs ({jobs.length})
                <div style={{ textAlign: 'right', display: 'inline-block', position: 'absolute', right: 52 }}>
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
                </div>
              </HeaderText>
              <Divider light className={classes.dividers} />

              <div className={classes.content}>
                <div>{this.renderJobs()}</div>
              </div>
            </Paper>

            {/* Team members view */}
            {this.renderProjectMembers()}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projectDetail: state.projectDetail,
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
    padding: '12px 32px 5px 32px',
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
      top: -3,
      cursor: 'pointer',
    },
  },
  iconSmall: {
    height: 20,
  },
  userCount: {
    verticalAlign: 'middle',
    position: 'relative',
    top: -8,
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
  caption: {
    color: '#000',
    padding: 8,
    fontSize: 14,
  },
  paginationSelectIcon: {
    marginTop: -5,
  },
  paginationSelect: {
    fontSize: 14,
  },
});

export default connect(mapStateToProps, {
  fetchProjectById,
  fetchAllJobsForProject,
  deleteAJobByJobId,
  fetchAllProjectMembers,
})(withStyles(styles)(ProjectDetail));

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

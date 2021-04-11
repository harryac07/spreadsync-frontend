import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { startCase, toLower, map, isEmpty } from 'lodash';
import Button from 'components/common/Button';
import {
  Paper,
  Divider,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { fetchProjectById, fetchAllJobsForProject } from './action';

import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import MoodIcon from '@material-ui/icons/Mood';

class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'job', // job or setting or newjob
      newJobInput: {}
    };
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchProjectById(id);
    this.props.fetchAllJobsForProject(id);
  }
  updateCurrentView = (selectedView = 'job') => {
    this.setState({ currentView: selectedView });
  };
  createNewJob = payload => {
    console.log(payload);
  };
  submitNewJobChange = (name, value) => {
    this.setState({
      newJobInput: {
        ...this.state.newJobInput,
        [name]: value
      }
    });
  };
  renderJobs = () => {
    const { classes, projectDetail } = this.props;
    const { jobs } = projectDetail;
    const projectId = this.props?.match?.params?.id ?? '';

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
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Job Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Created By</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map(row => (
              <TableRow hover key={row.id}>
                <TableCell component="th" scope="row">
                  <Link to={`/projects/${projectId}/job/${row.id}`} className={classes.jobName}>
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.user_email}</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    const { classes } = this.props;
    return (
      <div>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="center">Admin</TableCell>
              <TableCell align="center">Permission</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[].map(row => (
              <TableRow hover key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  render() {
    const { classes, projectDetail, history } = this.props;

    const { project, jobs = [] } = projectDetail;
    const { currentView, newJobInput } = this.state;

    const { name, total_members, description } = project[0] || {};
    const projectName = startCase(toLower(name));
    const { id } = this.props.match.params;

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
            <Paper elevation={3} className={classes.contentWrapper}>
              <HeaderText className={classes.HeaderText} padding="20px" fontsize={'18px'}>
                Team Members (5)
                <div style={{ textAlign: 'right', display: 'inline-block', position: 'absolute', right: 52 }}>
                  <Button startIcon={<GroupAddIcon className={classes.iconSmall} color="white" />} size="xs">
                    Invite user
                  </Button>
                </div>
              </HeaderText>
              <Divider light className={classes.dividers} />

              <div className={classes.content}>{this.renderProjectMembers()}</div>
            </Paper>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projectDetail: state.projectDetail
  };
};

const styles = theme => ({
  projectWrapper: {
    border: 0,
    borderRadius: 3,
    color: '#000',
    margin: '0 auto',
    position: 'relative',
    marginBottom: 0
  },
  HeaderText: {},
  userGroup: {
    display: 'inline-block',
    right: 20,
    verticalAlign: 'middle',
    marginLeft: 20
  },
  headerWrapper: {
    backgroundColor: '#fff',
    padding: '12px 32px 5px 32px',
    boxShadow: '0px 0px 1px 0px #888888'
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
      marginRight: 10
    },
    '& svg': {
      position: 'relative',
      top: -3,
      cursor: 'pointer'
    }
  },
  iconSmall: {
    height: 20
  },
  userCount: {
    verticalAlign: 'middle',
    position: 'relative',
    top: -8,
    paddingLeft: 5,
    fontWeight: 500
  },
  projectDescription: {
    fontSize: 14,
    background: '#eee',
    padding: 20,
    borderRadius: '10px',
    margin: '0px 20px 10px 20px'
  },
  divider: {
    margin: '10px auto'
  },
  createButton: {
    display: 'inline-block',
    textTransform: 'none'
  },
  noJobWrapper: {
    textAlign: 'left',
    margin: '0px auto',
    backgroundColor: '#fff'
  },
  contentWrapper: {
    margin: 32
  },
  content: {
    padding: 20
  },
  table: {
    border: '1px solid #eee'
  },
  jobName: { fontSize: 16, textDecoration: 'none', color: '#3A3C67', fontWeight: 500 }
});

export default connect(mapStateToProps, {
  fetchProjectById,
  fetchAllJobsForProject
})(withStyles(styles)(ProjectDetail));

export const HeaderText = styled.div`
  font-weight: bold;
  font-size: ${props => (props.fontsize ? props.fontsize : '22px')};
  display: ${props => (props.display ? props.display : 'flex')};
  align-items: center;
  justify-content: flex-start;
  padding: ${props => (props.padding ? props.padding : '0px')};
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

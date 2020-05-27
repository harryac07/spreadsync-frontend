import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { startCase, toLower } from 'lodash';
import { Paper, Divider, Button } from '@material-ui/core/';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import { fetchProjectById, fetchAllJobsForProject } from './action';

import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';

class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'job', // job or setting
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
  renderJobs = () => {
    const { classes, projectDetail } = this.props;
    const { jobs } = projectDetail;

    if (jobs.length === 0) {
      return (
        <div className={classes.noJobWrapper}>
          <p>
            No job has been created. &nbsp;
            <Button
              onClick={() => this.updateCurrentView('setting')}
              className={classes.createButton}
              color="secondary"
              variant="contained"
              size="small"
            >
              Create job
            </Button>
          </p>
        </div>
      );
    }
    return (
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              Jobs
              <span className={classes.jobLength}>({jobs.length})</span>
            </TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Created By</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((row) => (
            <TableRow hover key={row.id}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.description}</TableCell>
              <TableCell align="center">{row.type}</TableCell>
              <TableCell align="center">{row.user_email}</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
  render() {
    const { classes, projectDetail } = this.props;

    const { project } = projectDetail;
    const { currentView } = this.state;

    const { name, total_members, description } = project[0] || {};
    const projectName = startCase(toLower(name));
    return (
      <Paper>
        <div className={classes.projectWrapper}>
          <div>
            <HeaderText className={classes.HeaderText} display="inline-block">
              {projectName}
            </HeaderText>
            <div className={classes.userGroup}>
              <GroupIcon fontSize={'small'} />
              <span className={classes.userCount}>{total_members || 0}</span>
            </div>
            <div className={classes.headerIconWrapper}>
              {currentView === 'job' ? (
                <SettingsIcon color={'primary'} fontSize={'medium'} onClick={() => this.updateCurrentView('setting')} />
              ) : (
                <CancelIcon color={'error'} fontSize={'medium'} onClick={() => this.updateCurrentView('job')} />
              )}
            </div>
          </div>
          <Divider className={classes.divider} light />
        </div>

        {/* Setting or Jobs wrapper */}
        {currentView === 'job' ? (
          <div>
            <div className={classes.projectDescription}>
              <p>{description}</p>
            </div>
            {this.renderJobs()}
          </div>
        ) : (
          this.renderProjectSetting()
        )}
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projectDetail: state.projectDetail,
  };
};

const styles = {
  projectWrapper: {
    background: '#fff',
    border: 0,
    borderRadius: 3,
    color: '#000',
    padding: '15px',
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
  headerIconWrapper: {
    display: 'inline-block',
    position: 'absolute',
    right: 20,
    paddingTop: 0,
    cursor: 'pointer',
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
  jobLength: {
    marginLeft: 10,
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
    padding: 30,
    backgroundColor: '#fff',
  },
};

export default connect(mapStateToProps, {
  fetchProjectById,
  fetchAllJobsForProject,
})(withStyles(styles)(ProjectDetail));

export const HeaderText = styled.div`
  font-weight: bold;
  font-size: 22px;
  display: ${(props) => (props.display ? props.display : 'block')};
`;

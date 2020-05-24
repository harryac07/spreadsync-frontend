import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { startCase, toLower } from 'lodash';
import { Paper } from '@material-ui/core/';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import { fetchProjectById, fetchAllJobsForProject } from './action';

import GroupIcon from '@material-ui/icons/Group';

class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchProjectById(id);
    this.props.fetchAllJobsForProject(id);
  }

  renderJobs = () => {
    const { classes, projectDetail } = this.props;
    const { jobs } = projectDetail;
    return (
      <TableContainer component={Paper}>
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
      </TableContainer>
    );
  };
  render() {
    const { classes, projectDetail } = this.props;

    const { project } = projectDetail;

    const { name, total_members } = project[0] || {};
    const projectName = startCase(toLower(name));
    return (
      <div>
        <Paper className={classes.projectWrapper}>
          <div>
            <HeaderText display="inline-block">{projectName}</HeaderText>
            <div className={classes.userGroup}>
              <GroupIcon fontSize={'small'} />
              <span className={classes.userCount}>{total_members || 0}</span>
            </div>
          </div>
        </Paper>
        {this.renderJobs()}
      </div>
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
    marginBottom: 10,
  },
  userGroup: {
    display: 'inline-block',
    position: 'absolute',
    right: 20,
    paddingTop: 0,
  },
  userCount: {
    verticalAlign: 'middle',
    position: 'relative',
    top: -8,
    paddingLeft: 5,
    fontWeight: 500,
  },
  jobLength: {
    marginLeft: 10,
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

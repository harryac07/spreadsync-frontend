import React from 'react';
import { connect } from 'react-redux';
import { startCase, toLower, truncate } from 'lodash';

import { Grid, Paper, Divider } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
import { HeaderText } from './style';

import { fetchProjects } from './action';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.fetchProjects();
  }
  redirectToProjectDetail = (e, id) => {
    e.preventDefault();
    this.props.history.push(`/projects/${id}/`);
  };
  render() {
    const { projects } = this.props.store;
    const { classes } = this.props;
    return (
      <div>
        <Grid container spacing={3}>
          {projects.map((project) => {
            const projectName = startCase(toLower(project.name));
            const { id } = project;
            const { total_members } = project;
            const description = truncate(project.description, {
              length: 100,
            });
            return (
              <Grid item xs={12} sm={4} md={4} lg={4} xl={3} key={id}>
                <Paper className={classes.projectWrapper} onClick={(e) => this.redirectToProjectDetail(e, id)}>
                  <div className={classes.projectHeaderWrapper}>
                    <HeaderText display="inline-block" className={classes.headerText}>
                      {projectName}
                    </HeaderText>
                    <div className={classes.userGroup}>
                      <GroupIcon fontSize={'small'} className={classes.userGroupIcon} />
                      <span className={classes.userCount}>{total_members || 0}</span>
                    </div>
                  </div>
                  <Divider className={classes.divider} />
                  <div className={classes.projectBody}>
                    <p>{description}</p>
                  </div>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    store: state.project,
  };
};

const styles = (theme) => ({
  projectWrapper: {
    background: '#fff',
    border: 0,
    borderRadius: 3,
    color: '#000',
    padding: '20px',
    margin: '0 auto',
    position: 'relative',
    maxHeight: 300,
    minHeight: 150,
    [theme.breakpoints.up('xl')]: {
      maxHeight: 350,
      minHeight: 300,
    },
  },
  projectBody: {
    minHeight: 150,
    fontSize: 14,
  },
  headerText: {
    width: '80%',
  },
  userGroup: {
    width: '20%',
    textAlign: 'right',
    float: 'right',
  },
  divider: {
    margin: '10px auto',
  },
  userGroupIcon: {},
  userCount: {
    verticalAlign: 'middle',
    position: 'relative',
    top: -8,
    paddingLeft: 5,
    fontWeight: 500,
  },
  projectHeaderWrapper: {
    cursor: 'pointer',
  },
});

export default connect(mapStateToProps, {
  fetchProjects,
})(withStyles(styles)(Test));

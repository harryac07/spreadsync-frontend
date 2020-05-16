import React from 'react';
import { connect } from 'react-redux';
import { startCase, toLower, truncate } from 'lodash';

import { Grid, Paper, Divider } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
import { MainWrapper } from 'components/common/MainWrapper';
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
  render() {
    const { projects } = this.props.store;
    const { classes } = this.props;
    return (
      <MainWrapper>
        <Grid container spacing={3}>
          {projects.map((project) => {
            const projectName = startCase(toLower(project.name));
            const { id } = project;
            const description = truncate(project.description, {
              length: 100,
            });
            return (
              <Grid item xs={4} sm={4} md={4} key={id}>
                <Paper className={classes.projectWrapper}>
                  <HeaderText display="inline-block">{projectName}</HeaderText>
                  <div className={classes.userGroup}>
                    <GroupIcon fontSize={'small'} className={classes.userGroupIcon} />
                    <span className={classes.userCount}>20</span>
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
      </MainWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    store: state.project,
  };
};

const styles = {
  projectWrapper: {
    background: '#eee',
    border: 0,
    borderRadius: 3,
    color: '#000',
    padding: '20px',
    margin: '0 auto',
    position: 'relative',
  },
  projectBody: {
    minHeight: 150,
    fontSize: 14,
  },
  userGroup: {
    display: 'inline-block',
    position: 'absolute',
    right: 20,
    paddingTop: 0,
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
};

export default connect(mapStateToProps, {
  fetchProjects,
})(withStyles(styles)(Test));

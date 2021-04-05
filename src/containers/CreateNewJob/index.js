import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { startCase, toLower, map, isEmpty } from 'lodash';
import { Grid, Paper, Divider, Stepper, Step, StepLabel, Button } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { fetchProjectById } from 'containers/ProjectDetail/action';
import CreateNewJobForm from './Components/CreateNewJobForm';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import DataSourceConnector from './Components/AddDataSource';
import DataTargetConnector from './Components/AddDataTarget';
// import useProjectJobsHooks from '../hooks/useProjectJobsHooks';

const steps = [
  {
    label: 'Create a job',
    id: 0
  },
  {
    label: 'Connect data source',
    id: 1
  },
  {
    label: 'Connect data target',
    id: 2
  }
];

class CreateNewJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      navigableStepMax: 1
    };
  }
  componentDidMount() {
    const { projectDetail } = this.props;
    const { project } = projectDetail;
    if (project.length === 0) {
      const { id } = this.props.match.params;
      this.props.fetchProjectById(id);
    }
  }
  handleNavigableStepChange = step => {
    this.setState({ navigableStepMax: step });
  };

  handleStepChange = step => {
    this.setState({
      activeStep: step
    });
  };
  handleUpdateStep = step => {
    this.handleStepChange(step);
    this.handleNavigableStepChange(step);
  };

  renderDataTargetConnector = () => {
    const { data_destination } = this.state.inputObj;
    return (
      <div>
        <DataTargetConnector data_source={'spreadsheet'} handleSubmit={data => console.log(data)} />
      </div>
    );
  };

  render() {
    const { classes, projectDetail, history } = this.props;
    const { activeStep, navigableStepMax } = this.state;

    const { project, jobs = [] } = projectDetail;
    const { id, name, total_members, description } = project[0] || {};
    const projectName = startCase(toLower(name)) || 'Loading...';

    return (
      <div>
        {/* Project info */}
        <div className={classes.headerWrapper}>
          <HeaderText className={classes.HeaderText} display="inline-block">
            {projectName}
          </HeaderText>
          <div className={classes.userGroup}>
            <GroupIcon fontSize={'small'} />
            <span className={classes.userCount}>{total_members || 0}</span>
          </div>
        </div>

        {/* Add new job form and summary */}
        <div>
          <Paper elevation={3} className={classes.contentWrapper}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <HeaderText className={classes.HeaderText} fontsize={'18px'} padding="20px" display="inline-block">
                  Add new job
                </HeaderText>
                <Divider light className={classes.dividers} />

                <div className={classes.content}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(({ label, id }) => (
                      <Step
                        key={label}
                        onClick={e => {
                          e.preventDefault();
                          if (navigableStepMax >= id) {
                            this.handleStepChange(id);
                          }
                        }}
                      >
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === 0 && <CreateNewJobForm projectId={id} updateStep={this.handleUpdateStep} />}

                  {activeStep === 1 && (
                    <DataSourceConnector data_source={'database'} handleSubmit={data => console.log(data)} />
                  )}

                  {activeStep === 2 && (
                    <DataTargetConnector data_source={'spreadsheet'} handleSubmit={data => console.log(data)} />
                  )}
                </div>
              </Grid>
            </Grid>
          </Paper>
        </div>
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
  createJobRightbar: {
    backgroundColor: '#eee',
    minHeight: '70vh',
    maxHeight: '80vh'
  }
});

export default connect(mapStateToProps, { fetchProjectById })(withStyles(styles)(CreateNewJob));

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

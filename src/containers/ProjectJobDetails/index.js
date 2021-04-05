import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { startCase, toLower, map, isEmpty } from 'lodash';
import { Grid, Paper, Divider, Stepper, Step, StepLabel, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { fetchProjectById } from 'containers/ProjectDetail/action';
import CreateNewJobForm from './Components/CreateNewJobForm';
import GroupIcon from '@material-ui/icons/Group';
import useProjectJobsHooks from './hooks/useProjectJobsHooks';

import DataSourceConnector from './Components/AddDataSource';
import DataTargetConnector from './Components/AddDataTarget';

const steps = [
  {
    label: 'Job detail',
    createNewJobLabel: 'Create a job',
    id: 0
  },
  {
    label: 'Data source',
    createNewJobLabel: 'Connect data source',
    id: 1
  },
  {
    label: 'Data target',
    createNewJobLabel: 'Connect data target',
    id: 2
  }
];

const CreateNewJob = props => {
  const { id: projectId, jobid: jobId } = props?.match?.params ?? {};

  const [{ currentJob, currentJobDataSource, currentProject }, { createDataSource }] = useProjectJobsHooks(
    projectId,
    jobId
  );

  const [activeStep, setActiveStep] = useState(0);
  const [navigableStepMax, setNavigableStepMax] = useState(1);
  const dispatch = useDispatch();
  const classes = useStyles();
  const isCreatingNewJob = props?.match?.path?.includes('/job/new');

  useEffect(() => {
    if (isEmpty(currentProject)) {
      dispatch(fetchProjectById(projectId));
    }
  }, []);

  const handleNavigableStepChange = step => {
    setNavigableStepMax(step);
  };

  const handleStepChange = step => {
    setActiveStep(step);
  };
  const handleUpdateStep = step => {
    handleStepChange(step);
    handleNavigableStepChange(step);
  };

  const { id, name, total_members, description } = currentProject || {};
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
              <HeaderText className={classes.HeaderText} fontsize={'18px'} padding="20px 30px" display="inline-block">
                {isCreatingNewJob ? 'Add new job' : currentJob.name}
              </HeaderText>
              <Divider light className={classes.dividers} />

              <div className={classes.content}>
                <Stepper activeStep={activeStep} style={{ padding: '20px 0px', width: '60%', marginBottom: 10 }}>
                  {steps.map(({ label, id, createNewJobLabel }, index) => (
                    <Step
                      key={label}
                      onClick={e => {
                        e.preventDefault();
                        if (navigableStepMax >= id) {
                          handleStepChange(id);
                        }
                      }}
                    >
                      <StepLabel style={{ marginLeft: index === 0 ? -8 : 'inherit' }}>
                        {isCreatingNewJob ? createNewJobLabel : label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <div style={{ border: '1px solid #eee', padding: 30 }}>
                  {activeStep === 0 && (
                    <CreateNewJobForm projectId={id} updateStep={handleUpdateStep} defaultData={currentJob} />
                  )}

                  {activeStep === 1 && (
                    <DataSourceConnector
                      data_source={'database'}
                      defaultData={currentJobDataSource}
                      handleSubmit={data => console.log(data)}
                    />
                  )}

                  {activeStep === 2 && (
                    <DataTargetConnector data_source={'spreadsheet'} handleSubmit={data => console.log(data)} />
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
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
    padding: '20px 30px'
  },
  formWrapper: {
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
}));

export default CreateNewJob;

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

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { startCase, toLower, isEmpty } from 'lodash';
import { Grid, Paper, Divider, Stepper, Step, StepLabel } from '@material-ui/core/';
import { makeStyles, styled as muiStyled } from '@material-ui/core/styles';
import { fetchProjectById } from 'containers/ProjectDetail/action';
import CreateNewJobForm from './Components/CreateNewJobForm';
import GroupIcon from '@material-ui/icons/Group';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import useProjectJobsHooks from './hooks/useProjectJobsHooks';

import { ProjectJobContextProvider } from './context';
import DataSourceConnector from './Components/AddDataSource.tsx';
import DataTargetConnector from './Components/AddDataTarget.tsx';

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

  const [
    { currentJob = {}, currentJobDataSource, currentProject, currentSocialAuth, isNewJobCreated, spreadSheetConfig },
    { createNewJob, updateNewJob, createDataSource, updateDataSource, resetState, saveSocialAuth }
  ] = useProjectJobsHooks(jobId);

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const isCreatingNewJob = props?.match?.path?.includes('/job/new');

  const targetDataAuth = currentSocialAuth?.filter(data => (data.type = 'target'))[0];
  const [dataTargetConfig] = spreadSheetConfig;

  useEffect(() => {
    if (isEmpty(currentProject)) {
      dispatch(fetchProjectById(projectId));
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(currentJob)) {
      setCompletedSteps([...completedSteps, 0]);
    }
    if (!isEmpty(currentJob) && isNewJobCreated) {
      setCompletedSteps([...completedSteps, 0]);
      resetState();
      history.push(`/projects/${projectId}/job/${currentJob.id}`);
    }
    if (!isEmpty(currentJobDataSource)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJob, currentJobDataSource]);

  useEffect(() => {
    if (!isEmpty(dataTargetConfig)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTargetConfig]);

  const handleStepChange = step => {
    setActiveStep(step);
  };
  const handleUpdateStep = step => {
    handleStepChange(step);
  };

  const getSocialName = () => {
    return 'google';
  };

  const { id, name, total_members } = currentProject || {};
  const projectName = startCase(toLower(name)) || 'Loading...';

  return (
    <div>
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
                <Stepper activeStep={activeStep} style={{ padding: '20px 0px', width: '50%', marginBottom: 10 }}>
                  {steps.map(({ label, id, createNewJobLabel }, index) => {
                    const isCompleted = completedSteps.indexOf(id) >= 0;
                    const maxNumFromCompleted = Math.max(...completedSteps);
                    const isNavigationClickable =
                      !isCreatingNewJob || isCompleted || (id === maxNumFromCompleted + 1 && isCreatingNewJob);
                    return (
                      <Step
                        key={label}
                        onClick={e => {
                          e.preventDefault();
                          if (isNavigationClickable) {
                            handleStepChange(id);
                          }
                        }}
                      >
                        <StyledStepLabel
                          style={{ marginLeft: index === 0 ? -8 : 'inherit' }}
                          {...(isCompleted ? { icon: <CheckCircleIcon className={classes.completedStepLabel} /> } : {})}
                          StepIconProps={{
                            classes: { root: classes.remainingSteps }
                          }}
                        >
                          <span
                            style={id === activeStep ? { borderBottom: '2px solid #7ED7DA', paddingBottom: 5 } : {}}
                          >
                            {isCreatingNewJob ? createNewJobLabel : label}
                          </span>
                        </StyledStepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div style={{ border: '1px solid #eee', padding: 30 }}>
                  <ProjectJobContextProvider jobId={jobId}>
                    {activeStep === 0 && (
                      <CreateNewJobForm
                        projectId={id}
                        updateStep={() => null}
                        defaultData={currentJob}
                        handleSubmit={data => {
                          if (isCreatingNewJob) {
                            createNewJob(data);
                          } else {
                            updateNewJob(data);
                          }
                        }}
                      />
                    )}

                    {activeStep === 1 && (
                      <DataSourceConnector
                        data_source={'database'}
                        defaultData={currentJobDataSource}
                        handleSubmit={data => {
                          if (isEmpty(currentJobDataSource)) {
                            createDataSource(data);
                          } else {
                            updateDataSource(currentJobDataSource.id, data);
                          }
                        }}
                      />
                    )}

                    {activeStep === 2 && (
                      <DataTargetConnector
                        data_source={'spreadsheet'}
                        handleSubmit={authCode => {
                          const socialName = getSocialName();
                          saveSocialAuth(authCode, 'target', socialName);
                        }}
                        currentSocialAuth={targetDataAuth}
                        targetConfigurationCompleted={() => setCompletedSteps([...completedSteps, 2])}
                      />
                    )}
                  </ProjectJobContextProvider>
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
  },
  completedStepLabel: {
    color: 'green'
  },
  remainingSteps: {
    height: 28
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

const StyledStepLabel = muiStyled(StepLabel)(({ theme }) => {
  return {
    '& .MuiStepLabel-active': {
      fontWeight: 'bold'
    },
    cursor: 'pointer !important',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      whiteSpace: 'normal'
    }
  };
});

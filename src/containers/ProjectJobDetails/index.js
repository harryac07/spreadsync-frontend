import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { startCase, toLower, isEmpty } from 'lodash';
import { Grid, Paper, Divider, Stepper, Step, StepLabel } from '@material-ui/core/';
import { makeStyles, styled as muiStyled } from '@material-ui/core/styles';
import { fetchProjectById } from 'containers/ProjectDetail/action';
import CreateNewJobForm from './Components/CreateNewJobForm';
import GroupIcon from '@material-ui/icons/Group';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExportIcon from '@material-ui/icons/FlashOn';
import useProjectJobsHooks from './hooks/useProjectJobsHooks';
import Button from 'components/common/Button';
import ConfirmDialog from 'components/common/ConfirmDialog';

import { ProjectJobContextProvider } from './context';
import DataSourceConnector from './Components/AddDataSource';
import DataTargetConnector from './Components/AddDataTarget';
import { jobSteps } from './utils/jobSteps';

import { API_URL } from 'env';

const steps = jobSteps;

const CreateNewJob = props => {
  const { id: projectId, jobid: jobId } = props?.match?.params ?? {};

  const [state, { updateNewJob, resetState, saveSocialAuth, runExportJobManually }] = useProjectJobsHooks(jobId);
  const {
    currentJob = {},
    currentJobDataSource,
    currentProject,
    currentSocialAuth,
    selectedSpreadSheet,
    isNewJobCreated,
    spreadSheetConfig,
    currentManualJobRunning
  } = state;

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isManualJobRunning, setIsManualJobRunning] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const isCreatingNewJob = props?.match?.path?.includes('/job/new');

  const [dataTargetConfig] = spreadSheetConfig;

  useEffect(() => {
    if (isEmpty(currentProject)) {
      dispatch(fetchProjectById(projectId));
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(currentJobDataSource) && currentJob?.script) {
      setCompletedSteps([...completedSteps, 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJobDataSource]);

  useEffect(() => {
    const completedStepList = [];
    if (!isEmpty(currentJob)) {
      completedStepList.push(0);
    }
    if (currentJob?.is_data_source_configured) {
      completedStepList.push(1);
    }
    if (currentJob?.is_data_target_configured) {
      completedStepList.push(2);
    }
    if (completedStepList.length > 0) {
      setCompletedSteps(completedStepList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJob]);

  useEffect(() => {
    if (!isEmpty(currentJob) && isNewJobCreated) {
      resetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewJobCreated]);

  useEffect(() => {
    if (currentManualJobRunning === jobId) {
      setIsManualJobRunning(true);
    } else {
      setIsManualJobRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentManualJobRunning]);

  const handleStepChange = step => {
    setActiveStep(step);
  };

  const createNewJob = async reqPayload => {
    try {
      const response = await axios.post(`${API_URL}/jobs/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      history.push(`/projects/${projectId}/job/${response.data[0].id}`);
      toast.success(`Job created successfully!`);
      handleStepChange(1);
    } catch (e) {
      console.error('createNewJob: ', e.stack);
    }
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
              <ConfirmDialog
                ctaToOpenModal={
                  <Button
                    rootStyle={{
                      position: 'absolute',
                      display: 'inline-block',
                      right: 62,
                      marginTop: 15
                    }}
                    variant="outlined"
                    color="primary"
                    type="submit"
                    startIcon={isManualJobRunning ? <CircularProgress size={24} /> : <ExportIcon />}
                    disabled={isManualJobRunning}
                    className={classes.manualJobButton}
                  >
                    Run job manually
                  </Button>
                }
                header={<span>Are you sure to run the job manually?</span>}
                bodyContent={
                  'Running the job updates the changes the data depending on append or replace setting you have set in data target stage. This cannot be undone with this app.'
                }
                cancelText="Cancel"
                cancelCallback={() => null}
                confirmText="Confirm"
                confirmCallback={() => {
                  setIsManualJobRunning(true);
                  runExportJobManually();
                }}
              />

              <Divider light />

              <div className={classes.content}>
                <Stepper activeStep={activeStep} style={{ padding: '20px 0px', width: '50%', marginBottom: 10 }}>
                  {steps.map(({ label, id, createNewJobLabel }, index) => {
                    const isCompleted = completedSteps.indexOf(id) >= 0;
                    const maxNumFromCompleted = Math.max(...completedSteps);
                    const isNavigationClickable = isCompleted || id === maxNumFromCompleted + 1;
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
                      <DataSourceConnector markStepCompleted={() => setCompletedSteps([...completedSteps, 1])} />
                    )}

                    {activeStep === 2 && (
                      <DataTargetConnector
                        targetConfigurationCompleted={() => setCompletedSteps([...completedSteps, 2])}
                        dataTargetType={currentJob.data_target}
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
  manualJobButton: {
    border: '1px solid #3A3C67',
    '& :hover': {
      color: '#3A3C67'
    }
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
    color: '#3CB371',
    height: 30
  },
  remainingSteps: {
    height: 26
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

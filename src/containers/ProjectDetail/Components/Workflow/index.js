import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { keyBy, startCase, toLower } from 'lodash';
import { DragDropContext } from 'react-beautiful-dnd';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Workflow from './Components/workflow';
import ColumnJobs from './Components/ColumnJobs';
import SubNavWithBreadcrumb from 'components/common/SubNavWithBreadcrumb';
import Field from 'components/common/Field';
import Button from 'components/common/Button';
import ConfirmDialog from 'components/common/ConfirmDialog';

import ContainerWithHeader from 'components/ContainerWithHeader';
import { fetchProjectById, fetchAllJobsForProject, fetchWorkflowById } from '../../action';

const starterBlock = {
  [String(0)]: {
    step: '0',
    block: 'start',
    values: [],
  },
  [String(1)]: {
    step: '1',
    block: 'end',
    values: [],
  },
};

const App = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [workflow, setWorkflow] = useState(starterBlock);
  const [workflowName, setWorkflowName] = useState('');
  const [isTextFieldFocus, setIsTextFieldFocus] = useState(false);
  const { project_id: projectId, workflow_id: workflowId } = props?.match?.params ?? {};

  const { project, jobs, currentWorkflow } = useSelector((states) => {
    return {
      project: states.projectDetail?.project ?? [],
      jobs: states.projectDetail?.jobs ?? [],
      currentWorkflow: workflowId ? states.projectDetail.currentWorkflow : [],
    };
  });

  useEffect(() => {
    if (jobs?.length && !availableJobs.length) {
      setAvailableJobs(jobs);
    }
    if (projectId && !jobs?.length) {
      dispatch(fetchAllJobsForProject(projectId));
    }
    if (!workflowId && projectId && !project?.length) {
      dispatch(fetchProjectById(projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  useEffect(() => {
    if (workflowId) {
      dispatch(fetchWorkflowById(projectId, workflowId));
    }
  }, []);

  // Update the default values
  useEffect(() => {
    if (currentWorkflow?.length) {
      const { workflow: workflowFromBE, name } = currentWorkflow?.[0] ?? {};
      setWorkflow({
        0: starterBlock['0'],
        ...keyBy(workflowFromBE, 'step'),

        [String(workflowFromBE?.length + 1)]: {
          ...starterBlock['1'],
          step: String(workflowFromBE?.length + 1),
        },
      });
      setWorkflowName(name);

      if (jobs.length) {
        const setValues = workflowFromBE?.reduce((prev, currentWorkflow) => {
          return [...prev, ...currentWorkflow?.values];
        }, []);
        setAvailableJobs(
          jobs?.filter((each) => {
            return !setValues?.includes(each.id);
          })
        );
      }
    }
  }, [currentWorkflow, jobs]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    if (source.droppableId !== 'droppable-jobs' && destination.droppableId !== 'droppable-jobs') {
      /* Move within workflow from one step to another */
      const [, sourceStep] = source?.droppableId?.split('-');
      const [, destinationStep] = destination?.droppableId?.split('-');
      if (sourceStep === destinationStep) {
        return;
      }
      // Remove job id from source step
      const sourceWorkflow = workflow?.[sourceStep] ?? {};
      const sourceValues = sourceWorkflow?.values?.filter((each) => each !== draggableId) ?? [];
      // Add job id to destination step
      const destinationWorkflow = workflow?.[destinationStep] ?? {};
      const destinationValues = [...(destinationWorkflow?.values ?? []), draggableId];
      setWorkflow({
        ...workflow,
        [destinationStep]: {
          step: destinationStep,
          block: destinationWorkflow?.block,
          values: destinationValues,
        },
        [sourceStep]: {
          step: sourceStep,
          block: sourceWorkflow?.block,
          values: sourceValues,
        },
      });
      return;
    }
    /* Move job id from workflow to jobs section */
    if (destination.droppableId === 'droppable-jobs') {
      const [, step] = source?.droppableId?.split('-');
      const sourceWorkflow = workflow?.[step] ?? {};

      setWorkflow({
        ...workflow,
        [step]: {
          step: step,
          block: sourceWorkflow?.block,
          values: sourceWorkflow?.values?.filter((each) => each !== draggableId) ?? [],
        },
      });
      setAvailableJobs([...availableJobs, jobs?.find((each) => each.id === draggableId)]);
      return;
    }
    /* Move job id from available section to workflow */
    const [block, step] = destination?.droppableId?.split('-');
    const destinationWorkflow = workflow?.[step] ?? {};

    setWorkflow({
      ...workflow,
      [step]: {
        step: step,
        block: block,
        values: [...(destinationWorkflow?.values ?? []), draggableId],
      },
    });
    setAvailableJobs(
      availableJobs?.filter((each) => {
        return each.id !== draggableId;
      })
    );
  };
  const handleStepSelect = (block) => {
    const availableSteps = Object.keys(workflow);
    const highestKey = Math.max(...(availableSteps || [0]));
    const setupBlocks = getSetupStepBlocks();

    if (setupBlocks?.includes('end')) {
      // push end block to the end
      setWorkflow({
        ...workflow,
        [String(highestKey)]: {
          step: String(highestKey),
          block: block,
        },
        [String(highestKey + 1)]: {
          step: String(highestKey + 1),
          block: 'end',
        },
      });
    } else {
      setWorkflow({
        ...workflow,
        [String(highestKey + 1)]: {
          step: String(highestKey + 1),
          block: block,
        },
      });
    }
  };
  const handleStepDelete = (step) => {
    const { [step]: objsToRemoveFromWorkflow, ...restObj } = workflow;
    const jobIds = objsToRemoveFromWorkflow?.values ?? [];
    setWorkflow(restObj);
    setAvailableJobs([...availableJobs, ...jobs.filter(({ id }) => jobIds.includes(id))]);
  };

  const saveWorkflow = () => {
    const payload = {
      name: workflowName,
      project: projectId,
      workflow: Object.values(workflow)
        ?.filter(({ values = [] }) => {
          return values?.length;
        })
        .map((each, i) => {
          return {
            ...each,
            step: i + 1,
            values: each?.values ?? [],
          };
        }),
    };
    console.log('workflow ', payload);
  };

  const getSetupStepBlocks = () => {
    return Object.values(workflow)?.map(({ block }) => block) ?? [];
  };

  const getEmptySteps = () => {
    return Object.values(workflow)
      ?.filter(({ values, block }) => !(values?.length || ['start', 'end'].includes(block)))
      ?.map(({ step }) => step);
  };
  const formattedWorkflow = Object.keys(workflow).map((step) => {
    const obj = workflow?.[step] ?? {};
    return {
      ...obj,
      values: jobs?.length
        ? obj.values?.map((id) => {
            return jobs.find((each) => each.id === id);
          })
        : [],
    };
  });

  const { history } = props;
  const { name } = project[0] || {};
  const projectNameFromWorkflowPayload = currentWorkflow?.[0]?.project_name;

  const projectName = startCase(toLower(name || projectNameFromWorkflowPayload));
  const setupBlocks = getSetupStepBlocks();
  const emptyBlocksCount = getEmptySteps()?.length;
  const isButtonDisabled = !(
    (setupBlocks?.includes('series') || setupBlocks?.includes('parallel')) &&
    setupBlocks?.includes('end') &&
    availableJobs?.length < jobs?.length &&
    workflowName
  );

  return (
    <div className={classes.wrapper}>
      <SubNavWithBreadcrumb
        mainTitle={projectName}
        onTitleClick={() => history.push(`/projects/${projectId}`)}
        subPage="workflow"
        subPageName={workflowId ? workflowName : 'new'}
      />
      <div className={classes.workflowWrapper}>
        <DragDropContext onDragEnd={onDragEnd}>
          <ContainerWithHeader
            headerPadding={'12px 20px'}
            padding={20}
            elevation={1}
            headerLeftContent={
              <div onMouseEnter={() => setIsTextFieldFocus(true)} onMouseLeave={() => setIsTextFieldFocus(false)}>
                <Field
                  key={isTextFieldFocus ? 'workflow-name' : workflowName}
                  defaultValue={workflowName}
                  required={true}
                  placeholder="Worflow name"
                  name="name"
                  onChange={(e) => setWorkflowName(e.target.value)}
                  extrasmall
                  className={classes.input}
                  error={!workflowName}
                />
              </div>
            }
            headerRightContent={
              emptyBlocksCount === 0 ? (
                <Button disabled={isButtonDisabled} onClick={() => saveWorkflow()}>
                  Save workflow
                </Button>
              ) : (
                <ConfirmDialog
                  ctaToOpenModal={<Button disabled={isButtonDisabled}>Save workflow</Button>}
                  header={<span>Empty block step found!</span>}
                  bodyContent={`${emptyBlocksCount} empty blocks are left empty. Only block including at lease one job are taken into account and empty block steps are ignored. Do you want to continue?`}
                  cancelText="Cancel"
                  cancelCallback={() => null}
                  confirmText="Continue"
                  confirmCallback={saveWorkflow}
                />
              )
            }
          >
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Workflow
                  isDropDisabled={false}
                  handleStepDelete={handleStepDelete}
                  handleStepSelect={handleStepSelect}
                  workflow={keyBy(formattedWorkflow, 'step')}
                />
              </Grid>
              <Grid item xs={3}>
                <ColumnJobs isDropDisabled={true} jobs={availableJobs} />
              </Grid>
            </Grid>
          </ContainerWithHeader>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;

const useStyles = makeStyles((theme) => {
  return {
    input: {
      '& fieldset': { borderRadius: 0 },
    },
    workflowWrapper: { padding: 32 },
  };
});

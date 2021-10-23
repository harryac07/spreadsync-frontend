import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { keyBy, startCase, toLower } from 'lodash';
import { DragDropContext } from 'react-beautiful-dnd';
import { Paper, Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Workflow from './Components/workflow';
import ColumnJobs from './Components/ColumnJobs';
import SubNavWithBreadcrumb from 'components/common/SubNavWithBreadcrumb';
import { fetchProjectById, fetchAllJobsForProject } from '../../action';

const starterBlock = {
  [String(0)]: {
    step: '0',
    block: 'start',
    values: [],
  },
};

const App = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [workflow, setWorkflow] = useState(starterBlock);
  const projectId = props?.match?.params?.id;

  const { project, jobs } = useSelector((states) => {
    return {
      project: states.projectDetail?.project ?? [],
      jobs: states.projectDetail?.jobs ?? [],
    };
  });

  useEffect(() => {
    if (jobs?.length) {
      setAvailableJobs(jobs);
    } else if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchAllJobsForProject(projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  const onDragStart = (start) => {};
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    if (source.droppableId !== 'droppable-jobs' && destination.droppableId !== 'droppable-jobs') {
      // Move within workflow from one step to another
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
    if (destination.droppableId === 'droppable-jobs') {
      // move job id from workflow to jobs section
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
    const setupBlocks = Object.values(workflow)?.map(({ block }) => block) ?? [];

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

  const formattedWorkflow = Object.keys(workflow).map((step) => {
    const obj = workflow?.[step] ?? {};
    return {
      ...obj,
      values: obj.values?.map((id) => {
        return jobs.find((each) => each.id === id);
      }),
    };
  });
  const { history } = props;

  const { id, name } = project[0] || {};
  const projectName = startCase(toLower(name));
  return (
    <div>
      <SubNavWithBreadcrumb
        mainTitle={projectName}
        onTitleClick={() => history.push(`/projects/${id}`)}
        subPage="workflow"
        subPageName={'new'}
      />
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
      </DragDropContext>
    </div>
  );
};

export default App;

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {},
  };
});

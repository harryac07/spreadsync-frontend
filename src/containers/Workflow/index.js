import React from 'react';
import styled from 'styled-components';
import { keyBy } from 'lodash';
import { DragDropContext } from 'react-beautiful-dnd';
import { Paper, Divider, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import initialData from './initial-data';
import Workflow from './Components/workflow';
import ColumnJobs from './Components/ColumnJobs';

const initialJobs = [
  {
    id: '14d95767-70cd-4598-a7f1-fa0111cd7f4d',
    name: 'My Job 2',
    description: 'My Job 2',
    type: 'export',
    project: '5e19d1a3-20e9-4cdd-860f-0f502e8cfec6',
    data_source: 'database',
    data_target: 'spreadsheet',
    is_data_source_configured: false,
    is_data_target_configured: false,
    created_by: '4eff5220-3038-4cb0-bfd0-3135f82b688b',
    created_on: '2021-10-21T12:06:55.477Z',
    updated_on: null,
    user_email: 'harry_ac07@yahoo.com',
    user_id: '4eff5220-3038-4cb0-bfd0-3135f82b688b',
    frequency_name: 'fixed',
    unit: 'hours',
    value: 1,
  },
  {
    id: '8c6b6b39-5cb1-4b13-b1c9-a87cd7776b77',
    name: 'My Job 1',
    description: 'My Job 1',
    type: 'export',
    project: '5e19d1a3-20e9-4cdd-860f-0f502e8cfec6',
    data_source: 'spreadsheet',
    data_target: 'spreadsheet',
    is_data_source_configured: false,
    is_data_target_configured: false,
    created_by: '4eff5220-3038-4cb0-bfd0-3135f82b688b',
    created_on: '2021-10-21T12:06:46.140Z',
    updated_on: null,
    user_email: 'harry_ac07@yahoo.com',
    user_id: '4eff5220-3038-4cb0-bfd0-3135f82b688b',
    frequency_name: 'fixed',
    unit: 'hours',
    value: 1,
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allJobs: initialJobs,
      workflow: {},
    };
  }
  onDragStart = (start) => {};
  onDragEnd = (result) => {
    this.setState({
      homeIndex: null,
    });
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
      const sourceWorkflow = this.state.workflow?.[sourceStep] ?? {};
      const sourceValues = sourceWorkflow?.values?.filter((each) => each !== draggableId) ?? [];
      // Add job id to destination step
      const destinationWorkflow = this.state.workflow?.[destinationStep] ?? {};
      const destinationValues = [...(destinationWorkflow?.values ?? []), draggableId];
      const workflow = {
        ...this.state.workflow,
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
      };
      this.setState({
        workflow: workflow,
      });
      return;
    }
    if (destination.droppableId === 'droppable-jobs') {
      // move job id from workflow to jobs section
      const [, step] = source?.droppableId?.split('-');
      const workflow = this.state.workflow?.[step] ?? {};

      const obj = {
        step: step,
        block: workflow?.block,
        values: workflow?.values?.filter((each) => each !== draggableId) ?? [],
      };
      this.setState({
        workflow: {
          ...this.state.workflow,
          [step]: obj,
        },
        allJobs: [...this.state.allJobs, initialJobs?.find((each) => each.id === draggableId)],
      });
      return;
    }
    const [block, step] = destination?.droppableId?.split('-');
    const workflow = this.state.workflow?.[step] ?? {};
    const obj = {
      step: step,
      block: block,
      values: [...(workflow?.values ?? []), draggableId],
    };
    this.setState({
      workflow: {
        ...this.state.workflow,
        [step]: obj,
      },
      allJobs: this.state.allJobs?.filter((each) => {
        return each.id !== draggableId;
      }),
    });
  };
  render() {
    const { allJobs, workflow } = this.state;
    const formattedWorkflow = Object.keys(workflow).map((step) => {
      const obj = workflow?.[step] ?? {};
      return {
        ...obj,
        values: obj.values?.map((id) => {
          return initialJobs.find((each) => each.id === id);
        }),
      };
    });

    return (
      <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Workflow isDropDisabled={false} workflow={keyBy(formattedWorkflow, 'step')} />
          </Grid>
          <Grid item xs={3}>
            <ColumnJobs isDropDisabled={true} jobs={allJobs} />;
          </Grid>
        </Grid>
      </DragDropContext>
    );
  }
}
export default App;

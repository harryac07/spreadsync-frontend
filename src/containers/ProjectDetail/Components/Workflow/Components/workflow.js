import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Job from './Task';
import Shape from './Shape';

const Column = ({ workflow = {}, handleStepDelete, handleStepSelect }) => {
  const classes = useStyles();
  const setupBlocks = Object.values(workflow)?.map(({ block }) => block) ?? [];

  const availableSteps = Object.keys(workflow);
  const highestKey = Math.max(...(availableSteps || [0]));
  return (
    <Container>
      <Title>Workflow</Title>
      <DroppableWrapper>
        {availableSteps?.map((step, index) => {
          const { block, values = [] } = workflow?.[step] ?? {};
          const showPlusIconInShape =
            index === highestKey ||
            (setupBlocks?.includes('end') && index === availableSteps.indexOf(String(highestKey)) - 1);
          const isDroppableBlock = block === 'series' || block === 'parallel';
          const isSeriesAndSetupComplete = block === 'series' && !!values?.length;
          const isBlockDisabled = block === 'start' || block === 'end' || isSeriesAndSetupComplete;

          return (
            <div key={index} style={{ marginBottom: 50 }}>
              <Shape
                type={isDroppableBlock ? 'rectangle' : 'oval'}
                label={isDroppableBlock ? block : null}
                blocks={setupBlocks?.includes('end') ? ['Series', 'Parallel'] : ['Series', 'Parallel', 'End']}
                content={
                  isDroppableBlock ? (
                    <Droppable
                      droppableId={block + '-' + step}
                      isDropDisabled={isBlockDisabled}
                      direction="horizontal" // default - vertical
                    >
                      {(provided, snapshot) => (
                        <TaskList
                          // className={classes.gridContainer}
                          isDraggingOver={snapshot.isDraggingOver}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <InnerList jobs={values} />
                          {provided.placeholder}
                        </TaskList>
                      )}
                    </Droppable>
                  ) : (
                    block
                  )
                }
                isDottedBorder
                onDelete={isDroppableBlock ? () => handleStepDelete(step) : null}
                onBlockSelect={(block) => handleStepSelect(block)}
                withPlusIcon={showPlusIconInShape}
                isEndBlock={block === 'end'}
              />
            </div>
          );
        })}
      </DroppableWrapper>
    </Container>
  );
};

export default Column;

const InnerList = React.memo(({ jobs }) => {
  return (
    <Grid container spacing={1}>
      {jobs?.map((job, index) => {
        return (
          <Grid key={job.id} item sm={jobs.length > 1 ? 6 : 12} style={{ minWidth: 150 }}>
            <Job job={job} index={index} />
          </Grid>
        );
      })}
    </Grid>
  );
});

const Container = styled.div`
  margin: 8px 0px;
  border: 1px solid #f5f5f5;
  background: #f5f5f5;
  border-radius: 2px;
  padding: 0px 16px;
`;
const Title = styled.h3`
  padding: 0px;
  text-align: center;
`;
const DroppableWrapper = styled.div`
  min-height: 300px;
`;
const TaskList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'lightgrey' : 'inherit')};
`;

const useStyles = makeStyles(() => ({
  tooltip: {},
}));

import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
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
                    direction="vertical" // default
                  >
                    {(provided, snapshot) => (
                      <TaskList
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
    </Container>
  );
};

export default Column;

const InnerList = React.memo(({ jobs }) => {
  return (
    <>
      {jobs?.map((job, index) => {
        return <Job key={job.id} job={job} index={index} />;
      })}
    </>
  );
});

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 0px 16px 30px 16px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'lightgrey' : 'inherit')};
`;

const useStyles = makeStyles(() => ({
  tooltip: {},
}));

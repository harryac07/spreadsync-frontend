import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Job from './Task';
import Shape from './Shape';

const Column = ({ workflow = {} }) => {
  const classes = useStyles();

  const [selectedBlocks, setSelectedBlocks] = useState({
    [String(0)]: {
      step: '0',
      block: 'start',
      values: [],
    },
  });
  useEffect(() => {
    if (workflow) {
      setSelectedBlocks({
        ...selectedBlocks,
        ...workflow,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  const availableSteps = Object.keys(selectedBlocks);
  return (
    <Container>
      <Title>Workflow</Title>

      {availableSteps?.map((step, index) => {
        const { block, values = [] } = selectedBlocks?.[step] ?? {};
        const highestKey = Math.max(...(availableSteps || [0]));
        const showPlusIconInShape = index === Math.max(...(availableSteps || [0])) && block !== 'end';

        const isBlockDisabled = block === 'start' || block === 'end';

        return (
          <div key={index} style={{ marginBottom: 50 }}>
            <Shape
              type={block === 'start' || block === 'end' ? 'oval' : 'rectangle'}
              content={
                block === 'start' || block === 'end' ? (
                  block
                ) : (
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
                )
              }
              isDottedBorder
              onBlockSelect={(block) =>
                setSelectedBlocks({
                  ...selectedBlocks,
                  [String(highestKey + 1)]: {
                    step: String(highestKey + 1),
                    block: block,
                  },
                })
              }
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
  padding: 16px 16px 30px 16px;
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

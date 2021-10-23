import React, { useState } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { Tooltip, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Job from './Task';

const Column = (props) => {
  const isDropDisabled = false; //props.isDropDisabled;
  return (
    <Container>
      <Title>Jobs</Title>
      <Droppable
        droppableId={'droppable-jobs'}
        isDropDisabled={false}
        direction="vertical" // default
      >
        {(provided, snapshot) => (
          <TaskList isDraggingOver={snapshot.isDraggingOver} ref={provided.innerRef} {...provided.droppableProps}>
            <InnerList jobs={props.jobs} />
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;

const InnerList = React.memo(({ jobs }) => {
  return (
    <>
      {jobs.map((job, index) => {
        return <Job key={job.id} job={job} index={index} />;
      })}
    </>
  );
});

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
  text-align: center;
  background: #fff;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'lightgrey' : 'inherit')};
  flex-grow: 1;
  min-height: 100px;
  text-align: center;
`;

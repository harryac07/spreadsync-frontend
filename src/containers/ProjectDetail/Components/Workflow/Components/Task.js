import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Job = ({ job, index }) => {
  const isDragDisabled = false;
  return (
    <Draggable key={job.id} draggableId={job.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isDragDisabled={isDragDisabled}
        >
          {job.name}
        </Container>
      )}
    </Draggable>
  );
};
export default Job;

const Container = styled.div`
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 8px;
  background-color: ${(props) => (props.isDragDisabled ? 'lightgrey' : props.isDragging ? 'lightgreen' : '#fff')};
  color: ${(props) => (props.isDragDisabled ? '#aaa' : 'inherit')};
`;

import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const AlertBox = (props) => {
  const [open, setOpen] = React.useState(true);
  const { type = 'info', align = 'left', children } = props;
  let color = '';
  let bg = '';

  if (type === 'error') {
    color = 'rgb(97, 26, 21)';
    bg = 'rgb(253, 236, 234)';
  }
  if (type === 'warning') {
    color = 'rgb(102, 60, 0)';
    bg = 'rgb(255, 244, 229)';
  }
  if (type === 'info') {
    color = 'rgb(13, 60, 97)';
    bg = 'rgb(232, 244, 253)';
  }
  if (type === 'success') {
    color = 'rgb(30, 70, 32)';
    bg = 'rgb(237, 247, 237)';
  }
  return (
    <div>
      <Collapse in={open}>
        <Wrapper color={color} bg={bg} align={align}>
          <div className="children">{children}</div>
          <StyledIconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </StyledIconButton>
        </Wrapper>
      </Collapse>
    </div>
  );
};

export default AlertBox;

const Wrapper = styled.div`
  color: ${(props) => props.color};
  background-color: ${(props) => props.bg};
  padding: 10px 16px;
  font-size: 0.875rem;
  line-height: 1.43;
  border-radius: 4px;
  text-align: ${(props) => props.align};
  position: relative;
  white-space: normal;

  .children {
    display: inline-block;
    width: 80%;
  }
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  right: 10px;
  top: 5px;
`;

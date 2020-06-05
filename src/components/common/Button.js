import React from 'react';
import styled from 'styled-components';
import { Button as MuiButton } from '@material-ui/core/';

const Button = (props) => {
  const { children, onClick, className, color = 'primary', variant = 'contained', size = 'small' } = props;

  return (
    <StyledButton onClick={onClick} className={className} color={color} variant={variant} size={size}>
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled(MuiButton)`
  display: ${(props) => (props.display ? props.display : 'inline-block')};
  height: ${(props) => (props.size === 'xs' ? '30px' : 'inherit')};
  font-size: ${(props) => (props.size === 'xs' ? '14px' : 'inherit')};
  text-transform: ${(props) => (props.capital ? 'uppercase' : 'none')};
  line-height: ${(props) => (props.size === 'xs' ? '10px' : 'inherit')};
`;

import React from 'react';
import styled from 'styled-components';
import { Button as MuiButton } from '@material-ui/core/';

const Button = (props) => {
  const {
    children,
    onClick,
    className,
    color = 'primary',
    variant = 'contained',
    size = 'small',
    startIcon,
    display,
    float = 'none',
    fullWidth = false,
    rootStyle,
    disabled = false,
  } = props;

  return (
    <ButtonWrapper float={float} style={rootStyle}>
      <StyledButton
        onClick={onClick}
        className={className}
        color={color}
        variant={variant}
        size={size}
        display={display}
        startIcon={startIcon}
        fullWidth={fullWidth}
        disabled={disabled}
      >
        {children}
      </StyledButton>
    </ButtonWrapper>
  );
};

export default Button;

const StyledButton = styled(MuiButton)`
  display: ${(props) => (props.display ? props.display : 'flex')};
  height: ${(props) => (props.size === 'xs' ? '30px' : 'inherit')};
  font-size: ${(props) => (props.size === 'xs' ? '14px' : 'inherit')};
  text-transform: ${(props) => (props.capital ? 'uppercase' : 'none')};
  line-height: ${(props) => (props.size === 'xs' ? '10px' : 'inherit')};
`;

const ButtonWrapper = styled.div`
  display: block;
  float: ${(props) => (props.float === 'right' ? 'right' : props.float === 'left' ? 'left' : 'none')};
`;

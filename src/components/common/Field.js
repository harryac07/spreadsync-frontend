import React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
const Proptypes = require('prop-types');

const Field = (props) => {
  const {
    fullWidth = true,
    required = false,
    helperText = '',
    label = '',
    placeholder = '',
    multiline = false,
    onChange,
    rows = 1,
    size = 'small',
    extrasmall = false,
    type = 'input',
    name = '',
    variant = 'outlined',
    className,
    defaultValue = null,
    style = {},
    error = false,
    disabled = false,
  } = props;

  return (
    <div style={style}>
      {label ? (
        <TopLabel>
          {label} {required && <span className="required" />}
        </TopLabel>
      ) : null}
      <StyledTextField
        fullWidth={fullWidth}
        required={required}
        helperText={helperText}
        multiline={multiline}
        name={name}
        placeholder={placeholder}
        rows={rows}
        defaultValue={defaultValue}
        onChange={onChange}
        size={size}
        type={type}
        variant={variant}
        className={className}
        error={error}
        disabled={disabled}
        extrasmall={extrasmall.toString()}
      />
    </div>
  );
};

Field.propTypes = {
  fullWidth: Proptypes.bool,
  required: Proptypes.bool,
  helperText: Proptypes.string,
  label: Proptypes.string,
  name: Proptypes.string,
  placeholder: Proptypes.string,
  multiline: Proptypes.bool,
  onChange: Proptypes.func.isRequired,
  rows: Proptypes.number,
  size: Proptypes.string,
  extrasmall: Proptypes.bool,
  type: Proptypes.string,
  variant: Proptypes.string,
  defaultValue: Proptypes.any,
  style: Proptypes.object,
  error: Proptypes.bool,
  disabled: Proptypes.bool,
};
export default Field;

const TopLabel = styled.div`
  margin: 0px 0px 5px 0px;
  padding: 0;
  font-size: 16px;

  .required:after {
    content: ' *';
    color: red;
    font-size: 22px;
    position: absolute;
    margin-left: 5px;
    margin-top: -4px;
  }
`;

const StyledTextField = styled(TextField)`
  div {
    height: ${(props) => (props.extrasmall === 'true' ? '40px' : 'inherit')};
  }
  input {
    font-size: ${(props) => (props.extrasmall === 'true' ? '18px' : 'none')};
  }
`;

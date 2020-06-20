import React from 'react';
import styled from 'styled-components';
import MuiSelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
const Proptypes = require('prop-types');

const Select = (props) => {
  const {
    fullWidth = true,
    required = false,
    size = 'small',
    extrasmall = false,
    error = false,

    label = '',
    placeholder = '',
    multiple = false,
    onChange,
    name = '',
    variant = 'outlined',
    className,
    value = '',
    style = {},

    disabled = false,
    autoWidth = false,
    options = [],
  } = props;

  return (
    <div style={style}>
      {label && !placeholder ? <TopLabel>{label}</TopLabel> : null}
      <StyledFormControl required={required} fullWidth={fullWidth} error={error} size={size}>
        {(label || placeholder) && !value ? (
          <StyledInputLabel id="demo-simple-select-outlined-label">{label || placeholder}</StyledInputLabel>
        ) : null}
        <StyledSelect
          labelId="demo-simple-select-outlined-label-label"
          id="demo-simple-select-outlined-label"
          multiple={multiple}
          disabled={disabled}
          name={name}
          className={className}
          variant={variant}
          value={value}
          onChange={onChange}
          size={size}
          extrasmall={extrasmall.toString()}
          input={<StyledOutlinedInput />}
        >
          {options.map((option) => {
            return (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            );
          })}
        </StyledSelect>
      </StyledFormControl>
    </div>
  );
};

Select.propTypes = {
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
  type: Proptypes.string,
  variant: Proptypes.string,
  defaultValue: Proptypes.any,
  style: Proptypes.object,
  error: Proptypes.bool,
  disabled: Proptypes.bool,
};
export default Select;

const StyledInputLabel = styled(InputLabel)`
  position: absolute;
  padding: 0px 0px 0px 12px;
  top: -8px;
`;
const StyledFormControl = styled(FormControl)`
  svg {
    position: absolute;
    top: inherit;
    right: 0;
  }
`;
const TopLabel = styled.div`
  margin: 0px 0px 5px 0px;
  padding: 0;
  font-size: 16px;
`;

const StyledSelect = styled(MuiSelect)`
  height: ${(props) => (props.extrasmall === 'true' ? '40px' : 'inherit')};
`;

const StyledOutlinedInput = styled(OutlinedInput)`
  font-size: ${(props) => (props.extrasmall === 'true' ? '18px !important' : 'none')};
`;

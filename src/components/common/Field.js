import React from 'react';
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
    type = 'input',
    name = '',
    variant = 'outlined',
    className,
    defaultValue = null,
    style = {},
    error = false,
  } = props;

  return (
    <div style={style}>
      <TextField
        fullWidth={fullWidth}
        required={required}
        helperText={helperText}
        multiline={multiline}
        label={label}
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
  type: Proptypes.string,
  variant: Proptypes.string,
  defaultValue: Proptypes.any,
  style: Proptypes.object,
  error: Proptypes.bool,
};
export default Field;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    padding: '10px',
  },
}));

const Search = (props) => {
  const classes = useStyles();
  const {
    required = false,
    select = false,
    size = 'small',
    placeholder = 'Search',
    type = 'search',
    variant = 'outlined',
    handleSearch,
    style = {},
  } = props;
  return (
    <div style={style}>
      <TextField
        select={select}
        required={required}
        placeholder={placeholder}
        type={type}
        variant={variant}
        size={size}
        onChange={handleSearch}
      />
    </div>
  );
};
Search.propTypes = {
  handleSearch: PropTypes.func,
  keyword: PropTypes.string,
};
export default Search;

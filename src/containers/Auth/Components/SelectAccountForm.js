import React, { useState } from 'react';
import axios from 'axios';
import { startCase, toLower } from 'lodash';
import { Grid, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Field from 'components/common/Field';
import { API_URL } from 'env';

const LoginForm = ({ handleSubmit, submitButtonText = 'Next' }) => {
  const classes = useStyles();
  const [inputObj, handleInputChange] = useState({});
  const [error, handleError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange({
      ...inputObj,
      [name]: value,
    });
    handleError({
      ...error,
      [name]: !value ? `${startCase(toLower(name))} is required` : '',
    });
  };

  const isAccountNameAvailable = async (accountName) => {
    try {
      if (!accountName) {
        return false;
      }
      const accountNameCheckResponse = await axios.get(`${API_URL}/accounts/find/${accountName}`);
      const { data } = accountNameCheckResponse;
      if (data.length === 0) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };
  const isError = async () => {
    const { account_name } = inputObj;
    const validAccountName = await isAccountNameAvailable(account_name);
    if (account_name && validAccountName) {
      return false;
    }

    /* validate email error */
    const accountNameError = validAccountName ? '' : 'Account name has been taken already!';
    handleError({
      ...error,
      account_name: account_name ? accountNameError : 'Account name is required',
    });
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    const payload = inputObj;
    isError().then((isError) => {
      if (!isError) {
        handleSubmit(payload);
      }
    });
  };
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <div className={classes.selectLabel}>Pick an account name suitable for you.</div>
          <Field
            required={true}
            label={'Account name'}
            placeholder="Select account name"
            name="account_name"
            error={error.account_name ? true : false}
            onChange={handleChange}
            type="account_name"
            helperText={error.account_name && error.account_name.includes('taken already') ? error.account_name : ''}
          />
        </Grid>
      </Grid>
      <Button
        className={classes.submitButton}
        fullWidth
        variant="contained"
        color="primary"
        onClick={submitForm}
        type="submit"
      >
        {submitButtonText}
      </Button>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  submitButton: {
    margin: '20px auto',
    textTransform: 'none',
  },
  selectLabel: {
    fontWeight: 500,
    margin: '10px 0px',
    color: theme.palette.primary.main,
  },
}));

export default LoginForm;

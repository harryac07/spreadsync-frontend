import React, { useState } from 'react';
import { startCase, toLower } from 'lodash';
import { Grid, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { validateEmail } from 'utils';
import Field from 'components/common/Field';

const LoginForm = ({ handleSubmit }) => {
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
  const isError = () => {
    const { email, password } = inputObj;
    if (email && password && validateEmail(email)) {
      return false;
    }

    /* validate email error */
    const emailError = validateEmail(email) ? '' : 'Email is not valid';
    handleError({
      ...error,
      email: email ? emailError : 'Email is required',
      password: password ? '' : 'Password is required',
    });
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    const payload = inputObj;
    const errorExists = isError();
    if (!errorExists) {
      handleSubmit(payload);
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Field
            required={true}
            label={'Email'}
            placeholder="Email"
            name="email"
            error={error.email ? true : false}
            onChange={handleChange}
            type="email"
            helperText={error.email && error.email.includes('valid') ? 'Please enter valid email!' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Field
            required={true}
            label={'Password'}
            placeholder="Password"
            name="password"
            error={error.password ? true : false}
            onChange={handleChange}
            type="password"
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
        Submit
      </Button>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inviteMoreUserButton: {
    fontSize: 12,
    paddingTop: 6,
    marginBottom: 10,
  },
  inviteMoreField: {
    marginBottom: 10,
  },
  submitButton: {
    margin: '20px auto',
  },
  selectedCountSpan: {
    fontWeight: 500,
  },
}));

export default LoginForm;

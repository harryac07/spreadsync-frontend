import React, { useState } from 'react';
import { startCase, toLower } from 'lodash';
import { Paper, Grid, Divider, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

import Field from 'components/common/Field';

const SignupForm = ({ handleSubmit }) => {
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
    const { firstname, lastname, email, password, phone, company } = inputObj;
    if (firstname && lastname && email && password) {
      return false;
    }
    handleError({
      ...error,
      firstname: firstname ? '' : 'Firstname is required',
      lastname: lastname ? '' : 'Lastname is required',
      email: email ? '' : 'Email is required',
      password: password ? '' : 'Password is required',
    });
    return true;
  };

  const submitForm = () => {
    const payload = inputObj;
    const errorExists = isError();
    if (!errorExists) {
      handleSubmit(payload);
    } else {
      console.log('All fields required');
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Field
            required={true}
            // helperText={error.firstname ? 'Firstname is required' : ''}
            label={'Firstname'}
            placeholder="Firstname"
            name="firstname"
            error={error.firstname ? true : false}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Field
            required={true}
            label={'Lastname'}
            placeholder="Lastname"
            name="lastname"
            error={error.lastname ? true : false}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Field
            required={true}
            label={'Email'}
            placeholder="Email"
            name="email"
            error={error.email ? true : false}
            onChange={handleChange}
            type="email"
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
        <Grid item xs={12} sm={6} md={6}>
          <Field label={'Phone'} placeholder="Phone" name="phone" onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field label={'Company'} placeholder="Company" name="company" onChange={handleChange} />
        </Grid>
      </Grid>
      <Button className={classes.submitButton} fullWidth variant="contained" color="primary" onClick={submitForm}>
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

export default SignupForm;

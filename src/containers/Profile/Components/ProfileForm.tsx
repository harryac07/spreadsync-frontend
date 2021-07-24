import React, { useState, useEffect } from 'react';
import { isEmpty, startCase, toLower } from 'lodash';
import { Grid, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { validateEmail } from 'utils';
import Field from 'components/common/Field';

type InputProps =
  | {
      firstname: string;
      lastname: string;
      email: string;
      company?: string;
      phone?: string;
    }
  | any;
type ErrorProps = InputProps;
type Props = {
  handleSubmit: (data: any) => void;
  defaultValue: Partial<InputProps>;
};

const ProfileForm: React.FC<Props> = ({ handleSubmit, defaultValue }) => {
  const classes = useStyles();
  const [inputObj, handleInputChange] = useState<InputProps>({});
  const [error, handleError] = useState<ErrorProps>({});

  useEffect(() => {
    if (defaultValue && isEmpty(inputObj)) {
      handleInputChange(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

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
    const { firstname, lastname, email } = inputObj;
    if (firstname && lastname && email) {
      return false;
    }
    /* validate email error */
    const emailError = validateEmail(email) ? '' : 'Email is not valid';

    handleError({
      ...error,
      firstname: firstname ? '' : 'Firstname is required',
      lastname: lastname ? '' : 'Lastname is required',
      email: email ? emailError : 'Email is required',
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
    <form key={inputObj?.email}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Field
            required={true}
            // helperText={error.firstname ? 'Firstname is required' : ''}
            label={'Firstname'}
            placeholder="Firstname"
            name="firstname"
            defaultValue={inputObj?.firstname}
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
            defaultValue={inputObj?.lastname}
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
            defaultValue={inputObj?.email}
            helperText={
              error.email && error.email.includes('valid')
                ? 'Please enter valid email!'
                : 'Note: changing email requires email verification!'
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            label={'Phone'}
            defaultValue={inputObj?.phone}
            placeholder="Phone"
            name="phone"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            label={'Company'}
            defaultValue={inputObj?.company}
            placeholder="Company"
            name="company"
            onChange={handleChange}
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

export default ProfileForm;

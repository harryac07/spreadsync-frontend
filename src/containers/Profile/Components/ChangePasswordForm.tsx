import React, { useState } from 'react';
import { startCase, toLower } from 'lodash';
import { Grid, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Field from 'components/common/Field';

type InputProps =
  | {
      password: string;
      new_password: string;
      repeated_new_password: string;
    }
  | any;
type ErrorProps = InputProps;
type Props = {
  handleSubmit: (data: any) => void;
  defaultValue: Partial<InputProps>;
};

const ChangePasswordForm: React.FC<Props> = ({ handleSubmit, defaultValue }) => {
  const classes = useStyles();
  const [inputObj, handleInputChange] = useState<InputProps>({});
  const [error, handleError] = useState<ErrorProps>({});

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
    const { password, new_password, repeated_new_password } = inputObj;
    if (password && new_password && repeated_new_password && repeated_new_password === new_password) {
      return false;
    }
    handleError({
      ...error,
      password: password ? '' : 'Current password is required',
      new_password: new_password ? '' : 'New password is required',
      repeated_new_password:
        repeated_new_password !== new_password || !repeated_new_password ? 'Password not matched!' : null,
    });
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    const payload = {
      ...inputObj,
      email: defaultValue?.email,
    };
    const errorExists = isError();
    if (!errorExists) {
      handleSubmit(payload);
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Field
            required={true}
            helperText={error.password}
            label={'Current password'}
            placeholder="Current password"
            name="password"
            defaultValue={defaultValue?.password}
            error={error.password ? true : false}
            onChange={handleChange}
            type="password"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}></Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Field
            required={true}
            helperText={error.new_password}
            label={'New password'}
            placeholder="New password"
            name="new_password"
            defaultValue={defaultValue?.new_password}
            error={error.new_password ? true : false}
            onChange={handleChange}
            type="password"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Field
            required={true}
            helperText={error.repeated_new_password}
            label={'New password repeat'}
            placeholder="New password repeat"
            name="repeated_new_password"
            defaultValue={defaultValue?.repeated_new_password}
            error={error.repeated_new_password ? true : false}
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

export default ChangePasswordForm;

import React, { useState } from 'react';
import { startCase, toLower } from 'lodash';
import { Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import Button from 'components/common/Button';
import Radio from '@material-ui/core/Radio';

import CronGenerator from 'components/common/CronGenerator';
import DataConnector from './AddDataSource';

class CreateNewJobForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1,
      navigableStepMax: 1,
      inputObj: {
        database: 'PostgreSQL',
        database_extra: '',
      },
      error: {},
    };
  }
  handleInputChange = (data) => {
    this.setState({ inputObj: data });
  };
  handleError = (data) => {
    this.setState({ error: data });
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.handleInputChange({
      ...this.state.inputObj,
      [name]: value,
    });
    this.handleError({
      ...this.state.error,
      [name]: !value ? `${startCase(toLower(name))} is required` : '',
    });
  };
  isError = () => {
    const {
      database,
      host,
      port,
      name,
      user,
      password,
      database_extra,
      ssh_host,
      ssh_username,
      ssh_password,
      ssh_key,
    } = this.state.inputObj;
    if (database && host && port && name && user && password) {
      if (!database_extra) {
        return false;
      } else {
        if (ssh_host && ssh_username && ssh_password && ssh_key) {
          return false;
        }
      }
    }

    /* validate email error */
    this.handleError({
      ...this.state.error,
      name: name ? '' : 'Database name is required',
      database: database ? '' : 'Database is required',
      host: host ? '' : 'Database host is required',
      user: user ? '' : 'Database user is required',
      password: password ? '' : 'Database password is required',
      ssh_host: database_extra === 'ssl' || !database_extra ? '' : ssh_host ? '' : 'Database ssh_host is required',
      ssh_username:
        database_extra === 'ssl' || !database_extra ? '' : ssh_username ? '' : 'Database ssh_username is required',
      ssh_password:
        database_extra === 'ssl' || !database_extra ? '' : ssh_password ? '' : 'Database ssh_password is required',
      ssh_key: database_extra === 'ssl' || !database_extra ? '' : ssh_key ? '' : 'Database ssh_key is required',
    });
    return true;
  };

  submitForm = (e) => {
    e.preventDefault();
    const payload = this.state.inputObj;
    const { handleSubmit } = this.props;
    const errorExists = this.isError();
    console.log(payload, errorExists);
    if (!errorExists) {
      handleSubmit(payload);
    }
  };

  renderSSHForm = () => {
    const { error, inputObj } = this.state;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'SSH Host'}
            placeholder="SSH Host"
            name="ssh_host"
            error={error.ssh_host ? true : false}
            onChange={this.handleChange}
            size="small"
            defaultValue={inputObj.ssh_host}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'SSH Username'}
            placeholder="SSH Username"
            name="ssh_username"
            error={error.ssh_username ? true : false}
            onChange={this.handleChange}
            size="small"
            defaultValue={inputObj.ssh_username}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'SSH Password'}
            placeholder="SSH Password"
            name="ssh_password"
            error={error.ssh_password ? true : false}
            onChange={this.handleChange}
            size="small"
            defaultValue={inputObj.ssh_password}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'SSH Port'}
            placeholder="SSH Port (optional)"
            name="ssh_port"
            error={error.ssh_port ? true : false}
            onChange={this.handleChange}
            size="small"
            defaultValue={inputObj.ssh_port}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Field
            required={true}
            label={'SSH Key'}
            placeholder="SSH Key"
            name="ssh_key"
            error={error.ssh_key ? true : false}
            onChange={this.handleChange}
            size="small"
            defaultValue={inputObj.ssh_key}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, cancelSubmit } = this.props;
    const { error, inputObj } = this.state;
    return (
      <div>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Select
                required={true}
                label={'Database'}
                name="database"
                error={error.database ? true : false}
                options={[
                  { key: 'PostgreSQL', value: 'PostgreSQL', label: 'PostgreSQL' },
                  { key: 'MySQL', value: 'MySQL', label: 'MySQL' },
                  { key: 'SQL Server', value: 'SQL Server', label: 'SQL Server' },
                ]}
                onChange={this.handleChange}
                size="small"
                fullWidth={true}
                value={inputObj.database}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Field
                required={true}
                label={'Name (Alias)'}
                placeholder="Alias name"
                name="alias"
                error={error.alias ? true : false}
                onChange={this.handleChange}
                size="small"
                defaultValue={inputObj.alias}
              />
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
              <Field
                required={true}
                label={'Database Host'}
                placeholder="Host"
                name="host"
                error={!!error.host}
                onChange={this.handleChange}
                size="small"
                defaultValue={inputObj.host}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Field
                required={true}
                label={'Port'}
                placeholder="Port"
                name="port"
                error={!!error.port}
                onChange={this.handleChange}
                size="small"
                defaultValue={inputObj.port}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Field
                required={true}
                label={'Database name'}
                placeholder="Database name"
                name="name"
                error={!!error.name}
                onChange={this.handleChange}
                size="small"
                defaultValue={inputObj.name}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Field
                required={true}
                label={'Database user'}
                placeholder="Database user"
                name="user"
                error={!!error.user}
                onChange={this.handleChange}
                size="small"
                defaultValue={inputObj.user}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Field
                required={true}
                label={'Database password'}
                placeholder="Database password"
                name="password"
                error={!!error.password}
                onChange={this.handleChange}
                size="small"
                defaultValue={inputObj.password}
              />
            </Grid>
          </Grid>

          {/* SSL or SSH input */}
          <br />
          <Radio
            className={classes.radio}
            checked={inputObj.database_extra === 'ssl'}
            onChange={this.handleChange}
            value="ssl"
            name="database_extra"
            inputProps={{ 'aria-label': 'A' }}
          />
          <span className={classes.radioLabel}>SSL</span>
          <Radio
            className={classes.radio}
            checked={inputObj.database_extra === 'ssh'}
            onChange={this.handleChange}
            value="ssh"
            name="database_extra"
            inputProps={{ 'aria-label': 'B' }}
          />
          <span className={classes.radioLabel}>SSH</span>
          <br />
          <br />

          {inputObj.database_extra === 'ssh' ? this.renderSSHForm() : null}

          <div className={classes.buttonWrapper}>
            <Button
              rootStyle={{ display: 'inline-block', marginRight: 10 }}
              className={classes.cancelButton}
              fullWidth
              color="error"
              onClick={() => cancelSubmit(false)}
            >
              Cancel
            </Button>
            <Button
              rootStyle={{ display: 'inline-block' }}
              className={classes.submitButton}
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.submitForm}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

const styles = (theme) => ({
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
    display: 'inline-block',
  },
  cancelButton: {
    display: 'inline-block',
  },
  buttonWrapper: {
    float: 'right',
    display: 'inline-block',
  },
  selectedCountSpan: {
    fontWeight: 500,
  },
  step: {
    cursor: 'pointer',
  },
  radio: {
    padding: '9px 9px 9px 0px',
  },
  radioLabel: {
    margin: '0px 15px 5px 0px',
    padding: 0,
    fontSize: 16,
  },
});

export default withStyles(styles)(CreateNewJobForm);

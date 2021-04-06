import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { startCase, toLower, isEmpty } from 'lodash';
import { Grid } from '@material-ui/core/';
import Button from 'components/common/Button';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import Radio from '@material-ui/core/Radio';

const DataConnector = props => {
  const { data_source, handleSubmit, defaultData = {} } = props;
  const [inputObj, setInputObj] = useState({ database_extra: 'ssl' });
  const [error, setError] = useState({});

  const classes = useStyles();

  useEffect(() => {
    if (!isEmpty(defaultData)) {
      setInputObj({
        ...defaultData,
        database_extra: !!defaultData.is_ssh ? 'ssh' : 'ssl'
      });
    }
  }, [defaultData]);

  console.log(inputObj, error);

  let connectionText = '';
  switch (data_source) {
    case 'database':
      connectionText = 'Connect to database';
      break;
    default:
      connectionText = 'Data source connection';
  }
  const handleChange = e => {
    const { name, value } = e.target;
    setInputObj({
      ...inputObj,
      [name]: value
    });
    setError({ ...error, [name]: !value ? `${startCase(toLower(name))} is required` : '' });
  };

  const isError = () => {
    const {
      database_type,
      database_host,
      database_port,
      database_name,
      database_user,
      database_password,
      database_extra,
      ssh_host,
      ssh_username,
      ssh_password,
      ssh_key
    } = inputObj;
    if (database_type && database_host && database_port && database_name && database_user && database_password) {
      if (database_extra === 'ssl') {
        return false;
      } else {
        if (ssh_host && ssh_username && ssh_password && ssh_key) {
          return false;
        }
      }
    }

    /* validate email error */
    setError({
      ...error,
      database_name: database_name ? '' : 'Database name is required',
      database_type: database_type ? '' : 'Database is required',
      database_host: database_host ? '' : 'Database host is required',
      database_user: database_user ? '' : 'Database user is required',
      database_password: database_password ? '' : 'Database password is required',
      ssh_host: database_extra === 'ssl' || !database_extra ? '' : ssh_host ? '' : 'Database ssh_host is required',
      ssh_username:
        database_extra === 'ssl' || !database_extra ? '' : ssh_username ? '' : 'Database ssh_username is required',
      ssh_password:
        database_extra === 'ssl' || !database_extra ? '' : ssh_password ? '' : 'Database ssh_password is required',
      ssh_key: database_extra === 'ssl' || !database_extra ? '' : ssh_key ? '' : 'Database ssh_key is required'
    });
    return true;
  };

  const submitForm = e => {
    e.preventDefault();
    const errorExists = isError();
    console.log('inputObj ', inputObj, errorExists);
    if (!errorExists) {
      handleSubmit(inputObj);
    }
  };

  const renderSSHForm = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'SSH Host'}
            placeholder="SSH Host"
            name="ssh_host"
            error={error.ssh_host ? true : false}
            onChange={handleChange}
            size="small"
            defaultValue={inputObj.ssh_host}
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'SSH Username'}
            placeholder="SSH Username"
            name="ssh_username"
            error={error.ssh_username ? true : false}
            onChange={handleChange}
            size="small"
            defaultValue={inputObj.ssh_username}
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'SSH Password'}
            placeholder="SSH Password"
            name="ssh_password"
            error={error.ssh_password ? true : false}
            onChange={handleChange}
            size="small"
            defaultValue={inputObj.ssh_password}
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'SSH Port'}
            placeholder="SSH Port (optional)"
            name="ssh_port"
            error={error.ssh_port ? true : false}
            onChange={handleChange}
            size="small"
            defaultValue={inputObj.ssh_port}
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Field
            required={true}
            label={'SSH Key'}
            placeholder="SSH Key"
            name="ssh_key"
            error={error.ssh_key ? true : false}
            onChange={handleChange}
            size="small"
            defaultValue={inputObj.ssh_key}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      {/* {data_source === 'database' ? renderDatabaseSource() : null} */}
      {data_source === 'database' && (
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Select
                required={true}
                label={'Database'}
                name="database_type"
                error={error.database_type ? true : false}
                options={[
                  { key: 'PostgreSQL', value: 'PostgreSQL', label: 'PostgreSQL' },
                  { key: 'MySQL', value: 'MySQL', label: 'MySQL' },
                  { key: 'SQL Server', value: 'SQL Server', label: 'SQL Server' }
                ]}
                onChange={handleChange}
                size="small"
                fullWidth={true}
                value={inputObj.database_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Field
                required={true}
                label={'Name (Alias)'}
                placeholder="Alias name"
                name="alias_name"
                error={error.alias_name ? true : false}
                onChange={handleChange}
                size="small"
                defaultValue={inputObj.alias_name}
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
              <Field
                required={true}
                label={'Database Host'}
                placeholder="Database Host"
                name="database_host"
                error={!!error.database_host}
                onChange={handleChange}
                size="small"
                defaultValue={inputObj.database_host}
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Field
                required={true}
                label={'Port'}
                placeholder="Port"
                name="database_port"
                error={!!error.database_port}
                onChange={handleChange}
                size="small"
                defaultValue={inputObj.database_port}
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Field
                required={true}
                label={'Database name'}
                placeholder="Database name"
                name="database_name"
                error={!!error.database_name}
                onChange={handleChange}
                size="small"
                defaultValue={inputObj.database_name}
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Field
                required={true}
                label={'Database user'}
                placeholder="Database user"
                name="database_user"
                error={!!error.database_user}
                onChange={handleChange}
                size="small"
                defaultValue={inputObj.database_user}
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Field
                required={true}
                label={'Database password'}
                placeholder="Database password"
                name="database_password"
                error={!!error.database_password}
                onChange={handleChange}
                size="small"
                defaultValue={inputObj.database_password}
                multiline
              />
            </Grid>
          </Grid>

          {/* SSL or SSH input */}
          <br />
          <Radio
            className={classes.radio}
            checked={inputObj.database_extra === 'ssl'}
            onChange={handleChange}
            value="ssl"
            name="database_extra"
            inputProps={{ 'aria-label': 'A' }}
          />
          <span className={classes.radioLabel}>SSL</span>
          <Radio
            className={classes.radio}
            checked={inputObj.database_extra === 'ssh'}
            onChange={handleChange}
            value="ssh"
            name="database_extra"
            inputProps={{ 'aria-label': 'B' }}
          />
          <span className={classes.radioLabel}>SSH</span>
          <br />
          <br />

          {inputObj.database_extra === 'ssh' ? renderSSHForm() : null}

          <Grid container justify="flex-end" style={{ marginTop: 20 }}>
            <Grid item xs="auto">
              <Button
                rootStyle={{ display: 'inline-block' }}
                className={classes.submitButton}
                variant="contained"
                color="primary"
                onClick={submitForm}
                type="submit"
              >
                {isEmpty(defaultData) ? 'Save and continue' : 'Update'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </div>
  );
};

export default DataConnector;

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  inviteMoreUserButton: {
    fontSize: 12,
    paddingTop: 6,
    marginBottom: 10
  },
  inviteMoreField: {
    marginBottom: 10
  },
  submitButton: {
    display: 'inline-block'
  },
  cancelButton: {
    display: 'inline-block'
  },
  buttonWrapper: {
    float: 'right',
    display: 'inline-block',
    margin: '20px 0px'
  },
  selectedCountSpan: {
    fontWeight: 500
  },
  step: {
    cursor: 'pointer'
  },
  radio: {
    padding: '9px 9px 9px 0px'
  },
  radioLabel: {
    margin: '0px 15px 5px 0px',
    padding: 0,
    fontSize: 16
  }
}));

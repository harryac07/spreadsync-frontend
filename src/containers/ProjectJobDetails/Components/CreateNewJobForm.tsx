import React, { useState, useEffect } from 'react';
import { startCase, toLower, isEmpty } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import Button from 'components/common/Button';
import { Grid } from '@material-ui/core';

import CronGenerator from 'components/common/CronGenerator';
import { NewJobPayloadProps } from '../hooks/useProjectJobsHooks';

interface Props {
  updateStep: (value: number) => void;
  projectId: string;
  defaultData?: any;
  handleSubmit: (data) => void;
}
type FormProps = Omit<NewJobPayloadProps, 'project'>;

const CreateNewJobForm: React.FC<Props> = ({ defaultData, updateStep, projectId, handleSubmit }) => {
  const classes = useStyles();

  const [error, setError] = useState({} as FormProps);
  const [inputObj, setInputObj] = useState({
    unit: 'hours',
    value: 1
  } as FormProps);
  useEffect(() => {
    if (!isEmpty(defaultData)) {
      setInputObj(defaultData);
    }
  }, [defaultData]);

  const handleInputChange = data => {
    setInputObj({
      ...inputObj,
      ...data
    });
  };
  const handleError = data => {
    setError({ ...error, ...data });
  };
  const handleChange = e => {
    const { name, value } = e.target;
    handleInputChange({
      [name]: value
    });
    handleError({
      [name]: !value ? `${startCase(toLower(name))} is required` : ''
    });
  };
  const isError = () => {
    const { name, type, unit, value, data_source, data_target, description } = inputObj;
    if (name && type && unit && Number(value) && data_source && data_target && description) {
      return false;
    }

    /* validate email error */
    handleError({
      name: name ? '' : 'Job name is required',
      type: type ? '' : 'Data type is required',
      unit: unit ? '' : 'Frequency unit is required',
      value: Number(value) ? '' : 'Frequency value is required',
      data_source: data_source ? '' : 'Data source is required',
      data_target: data_target ? '' : 'Data target is required',
      description: description ? '' : 'Job description is required'
    });
    return true;
  };

  const submitForm = e => {
    e.preventDefault();
    const payload: NewJobPayloadProps = { ...inputObj, project: projectId };
    const errorExists = isError();
    if (!errorExists) {
      handleSubmit(payload);
      updateStep(1);
    }
  };
  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'Name'}
            placeholder="Job Name"
            name="name"
            error={!!error.name}
            onChange={handleChange}
            multiline
            size="small"
            defaultValue={inputObj.name}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Select
            required={true}
            label={'Job type'}
            name="type"
            error={error.type ? true : false}
            options={
              [
                { key: 'test', value: 'test', label: 'test' },
                { key: 'test1', value: 'test1', label: 'test1' },
                { key: 'test2', value: 'test2', label: 'test2' }
              ] as any
            }
            onChange={handleChange}
            size="small"
            fullWidth={true}
            value={inputObj.type}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Select
            required={true}
            label={'Data source'}
            name="data_source"
            error={!!error.data_source}
            options={[
              { value: 'database', label: 'Sql Database' },
              { value: 'api', label: 'API endpoint' },
              { value: 'crm', label: 'CRM' }
            ]}
            onChange={handleChange}
            size="small"
            fullWidth={true}
            value={inputObj.data_source}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Select
            required={true}
            label={'Data destination'}
            name="data_target"
            error={!!error.data_target}
            options={[
              { value: 'spreadsheet', label: 'Spreadsheet' },
              { value: 'slack', label: 'Slack' },
              { value: 'email', label: 'Email' }
            ]}
            onChange={handleChange}
            size="small"
            fullWidth={true}
            value={inputObj.data_target}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CronGenerator
            key={inputObj.unit + inputObj.value}
            defaultUnit={inputObj.unit}
            defaultValue={inputObj.value}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            required={true}
            label={'Description'}
            placeholder="Job description"
            name="description"
            error={!!error.description}
            onChange={handleChange}
            multiline
            rows={6}
            size="small"
            defaultValue={inputObj.description}
          />
        </Grid>
      </Grid>
      <Grid container justify="flex-end">
        <Grid item xs="auto">
          <Button
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
  );
};

const useStyles = makeStyles(() => ({
  submitButton: {
    margin: '20px auto'
  }
}));

export default CreateNewJobForm;

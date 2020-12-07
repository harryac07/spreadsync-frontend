import React, { useState } from 'react';
import { startCase, toLower } from 'lodash';
import { Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import Button from 'components/common/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import CronGenerator from 'components/common/CronGenerator';
import DataConnector from './AddDataSource';

class CreateNewJobForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 2,
      navigableStepMax: 1,
      inputObj: {
        unit: 'hours',
        value: 1,
      },
      error: {},
      summaryPayload: {},
    };
  }
  componentDidMount() {
    const prevInputFromObj = localStorage.getItem('new_job_object');
    const { submitStepUpdates } = this.props;
    if (prevInputFromObj) {
      const inputObj = JSON.parse(prevInputFromObj);
      this.setState({
        inputObj: {
          ...this.state.inputObj,
          ...inputObj,
        },
        activeStep: 1,
      });
      submitStepUpdates(inputObj);
    }
  }
  handleStepChange = (step) => {
    this.setState({ activeStep: step });
  };
  handleNavigableStepChange = (step) => {
    this.setState({ navigableStepMax: step });
  };
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
    const { name, type, unit, value, data_source, data_destination, description } = this.state.inputObj;
    if (name && type && unit && Number(value) && data_source && data_destination && description) {
      return false;
    }

    /* validate email error */
    this.handleError({
      ...this.state.error,
      name: name ? '' : 'Job name is required',
      type: type ? '' : 'Data type is required',
      unit: unit ? '' : 'Frequency unit is required',
      value: Number(value) ? '' : 'Frequency value is required',
      data_source: data_source ? '' : 'Data source is required',
      data_destination: data_destination ? '' : 'Data destination is required',
      description: description ? '' : 'Job description is required',
    });
    return true;
  };

  dispatchPayloadAndUpdateStep = (step, payload = {}) => {
    const { submitStepUpdates } = this.props;
    const { summaryPayload } = this.state;
    this.handleStepChange(step);
    this.handleNavigableStepChange(step);
    submitStepUpdates({ ...summaryPayload, ...payload });
  };

  submitForm = (e) => {
    e.preventDefault();
    const payload = this.state.inputObj;
    const { activeStep } = this.state;
    const { submitStepUpdates } = this.props;
    const errorExists = this.isError();
    if (!errorExists) {
      // createNewJob(payload);
      if (activeStep === 0) {
        // submitStepUpdates(payload);
        this.setState(
          {
            summaryPayload: {
              ...this.state.summaryPayload,
              ...payload,
            },
          },
          () => this.dispatchPayloadAndUpdateStep(1)
        );
      } else {
        console.log('Final Payload ', payload);
      }
    }
  };
  submitDataSource = (payload) => {
    console.log('data source payload ', payload, this.state.summaryPayload);
    this.setState(
      {
        summaryPayload: {
          ...this.state.summaryPayload,
          host: payload.host,
          alias: payload.alias,
        },
      },
      () => this.dispatchPayloadAndUpdateStep(2)
    );
  };

  submitDataTarget = (payload) => {
    console.log('data target payload ', payload);
    this.setState(
      {
        summaryPayload: {
          ...this.state.summaryPayload,
        },
      },
      () => this.dispatchPayloadAndUpdateStep(3)
    );
  };

  renderStep1Form = () => {
    const { classes } = this.props;
    const { error, inputObj } = this.state;
    return (
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Field
              required={true}
              label={'Name'}
              placeholder="Job name"
              name="name"
              error={error.name ? true : false}
              onChange={this.handleChange}
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
              options={[
                { key: 'test', value: 'test', label: 'test' },
                { key: 'test1', value: 'test1', label: 'test1' },
                { key: 'test2', value: 'test2', label: 'test2' },
              ]}
              onChange={this.handleChange}
              size="small"
              fullWidth={true}
              value={inputObj.type}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <CronGenerator
              defaultUnit={inputObj.unit}
              defaultValue={inputObj.value}
              onChange={this.handleChange}
              error={{ unit: !!error.unit, value: !!error.value }}
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
                { value: 'crm', label: 'CRM' },
              ]}
              onChange={this.handleChange}
              size="small"
              fullWidth={true}
              value={inputObj.data_source}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Select
              required={true}
              label={'Data destination'}
              name="data_destination"
              error={!!error.data_destination}
              options={[
                { value: 'spreadsheet', label: 'Spreadsheet' },
                { value: 'slack', label: 'Slack' },
                { value: 'email', label: 'Email' },
              ]}
              onChange={this.handleChange}
              size="small"
              fullWidth={true}
              value={inputObj.data_destination}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Field
              required={true}
              label={'Description'}
              placeholder="Job description"
              name="description"
              error={!!error.description}
              onChange={this.handleChange}
              multiline
              rows={4}
              size="small"
              defaultValue={inputObj.description}
            />
          </Grid>
        </Grid>
        <Button
          className={classes.submitButton}
          fullWidth
          variant="contained"
          color="primary"
          onClick={this.submitForm}
          type="submit"
          float={'right'}
        >
          Next
        </Button>
      </form>
    );
  };

  renderDataSourceConnector = () => {
    const { inputObj } = this.state;
    const { data_source } = inputObj;
    return (
      <div>
        <DataConnector data_source={data_source} handleSubmit={this.submitDataSource} />
      </div>
    );
  };

  renderDataTargetConnector = () => {
    const { inputObj } = this.state;
    const { data_destination } = inputObj;
    return (
      <div>
        <DataConnector data_source={data_destination} handleSubmit={this.submitDataTarget} />
      </div>
    );
  };

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;
    const steps = [
      {
        label: 'Job Info',
        id: 0,
      },
      {
        label: 'Connect data source',
        id: 1,
      },
      {
        label: 'Connect data target',
        id: 2,
      },
      {
        label: 'Overview',
        id: 3,
      },
    ];
    return (
      <div>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(({ label, id }) => (
            <Step
              key={label}
              onClick={(e) => {
                e.preventDefault();
                if (this.state.navigableStepMax >= id) {
                  this.handleStepChange(id);
                }
              }}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 ? this.renderStep1Form() : null}
        {activeStep === 1 ? this.renderDataSourceConnector() : null}
        {activeStep === 2 ? this.renderDataTargetConnector() : null}
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
    margin: '20px auto',
  },
  selectedCountSpan: {
    fontWeight: 500,
  },
  step: {
    cursor: 'pointer',
  },
});

export default withStyles(styles)(CreateNewJobForm);

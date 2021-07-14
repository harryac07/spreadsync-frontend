import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { startCase, toLower, isEmpty, map, isEqual } from 'lodash';
import { toast } from 'react-toastify';
import { Grid, Typography, AppBar, Tabs, Tab, Box } from '@material-ui/core/';
import Button from 'components/common/Button';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import APIEndpointDynamicField from './APIEndpointDynamicField';
import SqlEditor from './SqlEditor';
import { API_URL } from 'env';
import { useJobConfig } from '../context';

type Props = {
  requestType: 'target' | 'source';
  isDisabled?: boolean;
};
type InputPayloadProps = {
  alias?: string;
  method: 'GET' | 'POST';
  endpoint: string;
  params?: { key: string; value: string }[];
  headers?: { key: string; value: string }[];
  body?: any;
};
type ErrorProps = {
  method: string;
  endpoint: string;
};

const APIEndpointForm: React.FC<Props> = ({ requestType, isDisabled }) => {
  const classes = useStyles();
  const [inputObj, setInputObj] = useState({ method: 'GET' } as InputPayloadProps);
  const [error, setError] = useState({} as ErrorProps);
  const [currentTab, setCurrentTab] = useState(0);
  const [isChangedInput, setIsChangedInput] = useState(false);
  const [databaseConnectionMessage, setDatabaseConnectionMessage] = useState('');

  const [{ currentJob, apiConfig }, { createApiConfigForJob, updateApiConfigForJob, getApiConfigForJob }] =
    useJobConfig() || [];

  const [defaultData = {}] = apiConfig.filter(({ type }) => type === requestType);
  useEffect(() => {
    getApiConfigForJob();
  }, []);

  useEffect(() => {
    if (!isEmpty(defaultData)) {
      setInputObj({
        ...inputObj,
        ...defaultData,
        params: defaultData?.params ? JSON.parse(defaultData.params) : [],
        headers: defaultData?.headers ? JSON.parse(defaultData.headers) : [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputObj({
      ...inputObj,
      [name]: value,
    });
    setError({ ...error, [name]: !value ? `${startCase(toLower(name))} is required` : '' });

    // Keep track of changed input
    const isChanged = isDataChanged({
      ...inputObj,
      [name]: value,
    });
    setIsChangedInput(isChanged);
  };

  const isDataChanged = (newPayload) => {
    let changedKeys = [];
    map(newPayload, (value, key, o) => {
      const parsedDefaultVal =
        defaultData[key] && defaultData[key].includes('[{') ? JSON.parse(defaultData[key]) : defaultData[key];
      if (!isEqual(value, parsedDefaultVal)) {
        changedKeys.push(key);
      }
    });
    return changedKeys.length > 0;
  };

  const isError = () => {
    const { method, endpoint } = inputObj;

    if (!method || !endpoint) {
      /* validate email error */
      setError({
        ...error,
        method: method ? '' : 'Method is required',
        endpoint: endpoint ? '' : 'Endpoint is required',
      });
      return true;
    }
    return false;
  };

  const submitForm = (e) => {
    e.preventDefault();
    const errorExists = isError();
    const jobId = currentJob?.id;
    const payload = {
      ...inputObj,
      headers: JSON.stringify(inputObj.headers),
      params: JSON.stringify(inputObj.params),
      body: inputObj.body || '',
      job_id: jobId,
      type: requestType,
    };
    if (!errorExists) {
      if (defaultData?.id) {
        // update
        updateApiConfigForJob(defaultData.id, payload);
      } else {
        // create
        createApiConfigForJob(payload);
      }
      setIsChangedInput(false);
    } else {
      console.log('ERROR ', error);
    }
  };

  const handleCheckDatabaseConnection = async (apiConfigId) => {
    if (apiConfigId) {
      try {
        const jobId = currentJob?.id;
        if (!jobId) {
          throw new Error('Job Id is required!');
        }
        await axios.get(`${API_URL}/jobs/${jobId}/apiconfig/${apiConfigId}/connection-check`, {
          headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
        });
        setDatabaseConnectionMessage('Connection successful.');
      } catch (e) {
        toast.warning(`Couldn't confirm API connection`);
        setDatabaseConnectionMessage('Connection failed!');
      }
    } else {
      toast.warning(`Couldn't confirm API connection`);
      setDatabaseConnectionMessage('API config id is missing. Save the changes first!');
    }
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={2} sm={2}>
          <Select
            required={true}
            label={'Method'}
            name="method"
            error={!!error.method}
            options={[
              { key: 'GET', value: 'GET', label: 'GET' },
              { key: 'POST', value: 'POST', label: 'POST' },
            ]}
            onChange={handleChange}
            size="small"
            fullWidth={true}
            value={inputObj.method}
          />
        </Grid>
        <Grid item xs={12} sm={10} md={10}>
          <Field
            required={true}
            label={'Endpoint'}
            placeholder="API url"
            name="endpoint"
            error={!!error.endpoint}
            onChange={handleChange}
            size="small"
            defaultValue={inputObj.endpoint}
            multiline
          />
        </Grid>
      </Grid>
      {/* Headers and extras */}
      <br />
      <AppBar position="relative" color="default" classes={{ root: classes.appbar }}>
        <Tabs
          value={currentTab}
          indicatorColor="secondary"
          textColor="primary"
          onChange={(e, newValue) => setCurrentTab(newValue)}
        >
          <Tab label="Params" style={{ textTransform: 'none' }} />
          <Tab label="Headers" style={{ textTransform: 'none' }} />
          {inputObj.method === 'POST' && <Tab label="Body" style={{ textTransform: 'none' }} />}
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} tabIndex={0}>
        <Typography className={classes.fieldSection}>Add Params</Typography>
        <div
          style={{
            margin: '16px 0px',
          }}
        >
          <APIEndpointDynamicField
            inputFields={['key', 'value']}
            maxOptions={10}
            onChange={(data) =>
              handleChange({
                target: {
                  name: 'params',
                  value: data,
                },
              })
            }
            defaultValue={inputObj?.params ?? []}
          />
        </div>
      </TabPanel>
      <TabPanel value={currentTab} tabIndex={1}>
        <Typography className={classes.fieldSection}>Add Headers</Typography>
        <div
          style={{
            margin: '16px 0px',
          }}
        >
          <APIEndpointDynamicField
            inputFields={['key', 'value']}
            maxOptions={10}
            onChange={(data) =>
              handleChange({
                target: {
                  name: 'headers',
                  value: data,
                },
              })
            }
            fieldMinWidth={600}
            defaultValue={inputObj?.headers ?? []}
          />
        </div>
      </TabPanel>
      <TabPanel value={currentTab} tabIndex={2}>
        <Typography className={classes.fieldSection}>Add JSON Body</Typography>
        <div
          style={{
            margin: '16px 0px',
          }}
        >
          <SqlEditor
            handleSubmit={(data) => {
              handleChange({
                target: {
                  name: 'body',
                  value: data,
                },
              });
            }}
            defaultScript={''}
            language={'json'}
            submitWithButtonOnly={false}
          />
        </div>
      </TabPanel>
      {/* SSL or SSH input */}
      <br />
      <Grid container justify="space-between" style={{ marginTop: 20 }}>
        <Grid item xs="auto">
          <Button
            rootStyle={{ display: 'inline-block' }}
            className={classes.submitButton}
            variant="outlined"
            color="primary"
            onClick={() => handleCheckDatabaseConnection(defaultData.id)}
            type="submit"
            disabled={isChangedInput || isDisabled}
          >
            Test Connection
          </Button>
          {databaseConnectionMessage && (
            <span
              style={{
                marginLeft: 10,
                color: databaseConnectionMessage.includes('success') ? 'green' : 'red',
              }}
            >
              {databaseConnectionMessage}
            </span>
          )}
        </Grid>
        <Grid item xs="auto">
          <Button
            rootStyle={{ display: 'inline-block' }}
            className={classes.submitButton}
            variant="contained"
            color="primary"
            onClick={submitForm}
            type="submit"
            disabled={isDisabled}
          >
            {isEmpty(defaultData) ? 'Save and continue' : 'Update'}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default APIEndpointForm;

const useStyles = makeStyles(() => ({
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
    margin: '20px 0px',
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
  selectTableLabel: {
    margin: '0px 0px 5px 0px',
    padding: 0,
    fontSize: 16,
  },
  fieldSection: {
    margin: '0px 0px 5px 0px',
    padding: 0,
    fontSize: 16,
  },
  appbar: {
    background: '#fafafa',
    border: '1px solid #fafafa',
  },
}));

type TabPanelProps = {
  value: number | string;
  tabIndex: number | string;
};
const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, tabIndex } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== tabIndex}
      id={`simple-tabpanel-${tabIndex}`}
      aria-labelledby={`simple-tab-${tabIndex}`}
      style={{ border: '2px solid #eee', borderTop: 'none' }}
    >
      {value === tabIndex && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

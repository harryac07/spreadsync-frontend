import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { countBy, isEmpty } from 'lodash';
import { GoogleLogin } from 'react-google-login';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import Button from 'components/common/Button';
import { SingleSelect } from 'react-select-material-ui';
import { Grid, Radio, RadioGroup, FormControlLabel, Switch, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';

import { GOOGLE_CLIENT_ID } from 'env';
import { useJobConfig } from '../context';

interface Props {
  requestType?: 'target' | 'source';
}

const AddGoogleSheetForm: React.FC<Props> = ({ requestType }) => {
  const classes = useStyles();
  const [
    { currentJob, selectedSpreadSheet, spreadSheetConfig, isLoading, currentSocialAuth, googleSheetLists },
    {
      fetchSpreadSheet,
      saveSpreadsheetConfigForJob,
      getSpreadsheetConfigForJob,
      updateSpreadsheetConfigForJob,
      createNewSpreadSheet,
      saveSocialAuth,
      updateNewJob
    }
  ] = useJobConfig();

  const [authConnection] = currentSocialAuth?.filter(data => data.type === requestType);

  const { files = [], nextPageToken = '' } = googleSheetLists || {};
  const [sheetsData] = selectedSpreadSheet.filter(({ type }) => type === requestType);

  const [error, setError] = useState({} as any);
  const [inputObj, setInputObj] = useState({
    spreadsheet_id: '',
    sheet: '',
    sheet_name: '',
    range: 'A1',
    enrich_type: 'replace' as 'append' | 'replace', // append or replace
    include_column_header: true
  });

  const [configuredData] = spreadSheetConfig.filter(({ type }) => type === requestType);
  const { sheets = [] } = sheetsData || {};

  const isSheetConfigured = !isEmpty(configuredData);
  const mergedConfigurationData = {
    ...configuredData,
    ...{
      spreadsheet_id: sheetsData?.spreadsheetId,
      sheets: sheetsData?.sheets
    }
  };
  useEffect(() => {
    getSpreadsheetConfigForJob(requestType);
  }, []);

  useEffect(() => {
    if (!isEmpty(mergedConfigurationData)) {
      setInputObj({
        ...inputObj,
        ...{
          spreadsheet_id: mergedConfigurationData.spreadsheet_id,
          sheet: mergedConfigurationData.sheet || '',
          range: mergedConfigurationData.range || inputObj.range,
          enrich_type: mergedConfigurationData.enrich_type || inputObj.enrich_type,
          include_column_header: mergedConfigurationData.include_column_header || inputObj.include_column_header
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuredData, sheetsData]);

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
      [name]: !value ? `${name} is required` : ''
    });
  };
  const isError = () => {
    const { spreadsheet_id, sheet, range } = inputObj;
    const isSheetSelected = sheet !== '';
    if (spreadsheet_id && isSheetSelected && range) {
      return false;
    }

    /* validate email error */
    handleError({
      spreadsheet_id: spreadsheet_id ? '' : 'spreadsheet is required',
      sheet: isSheetSelected ? '' : 'sheet is required',
      range: range ? '' : 'range is required'
    });
    return true;
  };
  const submitForm = e => {
    e.preventDefault();
    const selectedSheet = sheets?.find(({ properties }) => properties?.sheetId?.toString() === inputObj?.sheet);
    const sheetName = selectedSheet?.properties?.title;
    const payload = { ...inputObj, type: requestType, sheet_name: sheetName };
    const errorExists = isError();
    if (!errorExists) {
      if (isSheetConfigured) {
        updateSpreadsheetConfigForJob(configuredData.id, payload);
      } else {
        saveSpreadsheetConfigForJob(payload);
      }
      /* Mark job as configured */
      const updateJobCompletedPayload =
        requestType === 'source'
          ? { is_data_source_configured: true }
          : { is_data_target_configured: true, is_data_source_configured: true };

      updateNewJob({
        data_source: currentJob?.data_source,
        data_target: currentJob?.data_target,
        ...updateJobCompletedPayload
      });
    }
  };

  const handleSpreadsheetConnectionSuccess = response => {
    const code = response?.code ?? '';
    if (code) {
      const socialName = 'google';
      saveSocialAuth(code, requestType, socialName);
    }
  };
  const handleSpreadsheetConnectionError = response => {
    const error = response?.error ?? '';
    if (error) {
      alert(error);
    }
  };

  return (
    <div>
      {authConnection ? (
        <>
          <h3>Connected to Google Spreadsheet</h3>
          <br />

          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.jobTypeLable}>Select spreadsheet</Typography>
                    <SingleSelect
                      value={inputObj.spreadsheet_id}
                      placeholder="Select spreadsheet"
                      options={files.map(file => ({ key: file.id, value: file.id, label: file.name }))}
                      helperText="Select the existing Spreadsheet or create new one"
                      SelectProps={{
                        isCreatable: true,
                        isValidNewOption: (inputValue: string) => inputValue !== '',
                        formatCreateLabel: (value: string) => `${value} (Creating new...)`
                      }}
                      onChange={(value, obj) => {
                        const { __isNew__ } = obj as any;
                        if (__isNew__) {
                          createNewSpreadSheet(value, requestType);
                        } else {
                          handleChange({
                            target: { value, name: 'spreadsheet_id' }
                          });
                          fetchSpreadSheet(value, requestType);
                        }
                      }}
                    />
                    {isLoading ? (
                      <CircularProgress size={30} style={{ position: 'absolute', marginLeft: 15 }} color="primary" />
                    ) : null}
                    <br />
                    <br />
                  </Grid>
                </Grid>
              </Grid>

              {inputObj?.spreadsheet_id && (
                <>
                  <Grid item xs={12} sm={6} md={6}>
                    <Select
                      required={true}
                      label={'Sheet name'}
                      name="sheet"
                      error={!!error.sheet}
                      options={
                        sheets?.map(({ properties }) => ({
                          label: properties?.title,
                          value: properties?.sheetId?.toString(),
                          key: properties?.sheetId
                        })) as any
                      }
                      onChange={handleChange}
                      size="small"
                      fullWidth={true}
                      value={inputObj.sheet}
                    />
                  </Grid>

                  {/* Display only when requestType is target */}
                  {requestType === 'target' && (
                    <>
                      <Grid item xs={12} sm={6} md={6}>
                        <Field
                          required={true}
                          label={'Range'}
                          placeholder="Range"
                          name="range"
                          error={!!error.range}
                          onChange={handleChange}
                          multiline
                          size="small"
                          defaultValue={inputObj.range}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6}>
                        <Typography className={classes.jobTypeLable}>Job Type</Typography>
                        <RadioGroup row name="enrich_type" value={inputObj.enrich_type} onChange={handleChange}>
                          <FormControlLabel value="replace" control={<Radio />} label="Replace data" />
                          <FormControlLabel value="append" control={<Radio />} label="Append data" />
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <Typography className={classes.jobTypeLable}>Include column headers</Typography>
                        <Switch
                          checked={inputObj.include_column_header}
                          color="primary"
                          onChange={e => {
                            setInputObj({
                              ...inputObj,
                              include_column_header: e.target.checked
                            });
                          }}
                          name="include_column_header"
                        />
                      </Grid>
                    </>
                  )}

                  <Grid container justify="flex-end">
                    <Grid item xs="auto">
                      <Button
                        className={classes.submitButton}
                        variant="contained"
                        color="primary"
                        onClick={submitForm}
                        type="submit"
                      >
                        {isSheetConfigured ? 'Update' : 'Save'}
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </>
      ) : (
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText={'Authorize to Google'}
          onSuccess={handleSpreadsheetConnectionSuccess}
          onFailure={handleSpreadsheetConnectionError}
          cookiePolicy={'single_host_origin'}
          scope={[
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/spreadsheets'
          ].join(' ')}
          responseType={'code'}
          accessType={'offline'}
          prompt={'consent'}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  submitButton: {
    margin: '20px auto'
  },
  jobTypeLable: {
    margin: '0px 0px 5px 0px',
    padding: 0,
    fontSize: 16
  }
}));

export default AddGoogleSheetForm;

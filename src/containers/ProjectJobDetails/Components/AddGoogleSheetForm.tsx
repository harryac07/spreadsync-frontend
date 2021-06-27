import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';
import { GoogleLogin } from 'react-google-login';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import Button from 'components/common/Button';
import Creatable from 'react-select/creatable';
import { withAsyncPaginate } from 'react-select-async-paginate';

import { Grid, Radio, RadioGroup, FormControlLabel, Switch, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { GOOGLE_CLIENT_ID } from 'env';
import { useJobConfig } from '../context';

interface Props {
  requestType?: 'target' | 'source';
}

const CreatableAsyncPaginate = withAsyncPaginate(Creatable);

const googleScopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];
const googleAuthIssueErrors = ['Invalid Credentials', 'invalid_grant'];
const sheetPageSize = 50;

const AddGoogleSheetForm: React.FC<Props> = ({ requestType }) => {
  const classes = useStyles();
  const [
    {
      currentJob,
      selectedSpreadSheet,
      spreadSheetConfig,
      isLoading,
      error: storeError = {},
      currentSocialAuth,
      googleSheetLists,
    },
    {
      fetchSpreadSheet,
      saveSpreadsheetConfigForJob,
      getSpreadsheetConfigForJob,
      fetchAllGoogleSheetsForJob,
      updateSpreadsheetConfigForJob,
      createNewSpreadSheet,
      saveSocialAuth,
      updateNewJob,
    },
  ] = useJobConfig();

  const [authConnection] = currentSocialAuth?.filter((data) => data.type === requestType);
  const currentSpreadsheetError = storeError[`spreadsheet-${requestType}`];
  const shouldUserReAuthorizeSpreadsheet =
    googleAuthIssueErrors.includes(currentSpreadsheetError) && !isEmpty(authConnection);

  const [googleSpreadsheets] = googleSheetLists.filter(({ type }) => type === requestType);
  const { files = [], nextPageToken = '' } = googleSpreadsheets || {};
  const [sheetsData] = selectedSpreadSheet.filter(({ type }) => type === requestType);

  const [error, setError] = useState({} as any);
  const [inputObj, setInputObj] = useState({
    spreadsheet_id: '',
    spreadsheet_name: '',
    sheet: '',
    sheet_name: '',
    range: 'A1',
    enrich_type: 'replace' as 'append' | 'replace', // append or replace
    include_column_header: false,
  });

  const [configuredData] = spreadSheetConfig.filter(({ type }) => type === requestType);
  const { sheets = [], spreadsheetName = '' } = sheetsData || {};

  const isSheetConfigured = !isEmpty(configuredData);
  const mergedConfigurationData = {
    ...configuredData,
    ...{
      spreadsheet_id: sheetsData?.spreadsheetId,
      spreadsheet_name: spreadsheetName,
      sheets: sheetsData?.sheets,
    },
  };
  useEffect(() => {
    getSpreadsheetConfigForJob(requestType);
    fetchAllGoogleSheetsForJob(requestType);
  }, []);

  useEffect(() => {
    if (!isEmpty(mergedConfigurationData)) {
      setInputObj({
        ...inputObj,
        ...{
          spreadsheet_id: mergedConfigurationData.spreadsheet_id,
          spreadsheet_name: mergedConfigurationData.spreadsheet_name,
          sheet: mergedConfigurationData.sheet || '',
          range: mergedConfigurationData.range || inputObj.range,
          enrich_type: mergedConfigurationData.enrich_type || inputObj.enrich_type,
          include_column_header: mergedConfigurationData.include_column_header || inputObj.include_column_header,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuredData, sheetsData]);

  const handleInputChange = (data) => {
    setInputObj({
      ...inputObj,
      ...data,
    });
  };
  const handleError = (data) => {
    setError({ ...error, ...data });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange({
      [name]: value,
    });
    handleError({
      [name]: !value ? `${name} is required` : '',
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
      range: range ? '' : 'range is required',
    });
    return true;
  };
  const submitForm = (e) => {
    e.preventDefault();
    const selectedSheet = sheets?.find(({ properties }) => properties?.sheetId?.toString() === inputObj?.sheet);

    const sheetName = selectedSheet?.properties?.title;
    const payload = { ...inputObj, type: requestType, sheet_name: sheetName, spreadsheet_name: spreadsheetName };
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
        ...updateJobCompletedPayload,
      });
    }
  };

  const handleSpreadsheetConnectionSuccess = (response) => {
    const code = response?.code ?? '';
    if (code) {
      const socialName = 'google';
      saveSocialAuth(code, requestType, socialName);
    }
  };
  const handleSpreadsheetConnectionError = (response) => {
    const error = response?.error ?? '';
    if (error) {
      alert(error);
    }
  };

  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, ms);
    });

  const loadSpreadSheetOptions = async (search = '', prevOptions) => {
    await sleep(1000);
    const searchLower = search?.toLowerCase();

    if (nextPageToken && !search) {
      fetchAllGoogleSheetsForJob(requestType, nextPageToken);
    }

    let filteredOptions = files.map((file) => ({ key: file.id, value: file.id, label: file.name }));

    if (searchLower) {
      filteredOptions = filteredOptions.filter(({ label }) => label.toLowerCase().includes(searchLower));
    }

    const slicedOptions = filteredOptions.slice(prevOptions.length, prevOptions.length + sheetPageSize);

    return {
      options: slicedOptions,
      hasMore: !!nextPageToken,
    };
  };
  return (
    <div>
      {authConnection && !shouldUserReAuthorizeSpreadsheet ? (
        <>
          <h3>Connected to Google Spreadsheet</h3>
          <br />

          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <Typography className={classes.jobTypeLable}>Select spreadsheet</Typography>
                    <div style={{ position: 'relative' }}>
                      <CreatableAsyncPaginate
                        placeholder={'Select spreadsheet'}
                        SelectComponent={Creatable}
                        // isDisabled={isAddingInProgress}
                        value={{
                          label: inputObj.spreadsheet_name,
                          value: inputObj.spreadsheet_id,
                        }}
                        options={[
                          ...files,
                          ...(inputObj.spreadsheet_id && !files.some(({ id }) => id === inputObj.spreadsheet_id)
                            ? [{ id: inputObj.spreadsheet_id, name: spreadsheetName }]
                            : []),
                        ].map((file) => ({ key: file.id, value: file.id, label: file.name }))}
                        loadOptions={loadSpreadSheetOptions}
                        onCreateOption={(value) => createNewSpreadSheet(value, requestType)}
                        onChange={({ value }) => {
                          handleChange({
                            target: { value, name: 'spreadsheet_id' },
                          });
                          fetchSpreadSheet(value, requestType);
                        }}
                      />
                      {isLoading ? (
                        <CircularProgress
                          size={30}
                          style={{
                            width: 30,
                            height: 30,
                            position: 'absolute',
                            marginLeft: 15,
                            top: 5,
                            right: '-40px',
                          }}
                          color="primary"
                        />
                      ) : null}
                    </div>
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
                          key: properties?.sheetId,
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
                        <Typography className={classes.jobTypeLable}>
                          Include column headers if the export contains header?
                        </Typography>
                        <Switch
                          checked={inputObj.include_column_header}
                          color="primary"
                          onChange={(e) => {
                            setInputObj({
                              ...inputObj,
                              include_column_header: e.target.checked,
                            });
                          }}
                          name="include_column_header"
                        />
                      </Grid>
                    </>
                  )}

                  {requestType === 'source' && (
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography className={classes.jobTypeLable}>Does the sheet contain column header?</Typography>
                      <Switch
                        checked={inputObj.include_column_header}
                        color="primary"
                        onChange={(e) => {
                          setInputObj({
                            ...inputObj,
                            include_column_header: e.target.checked,
                          });
                        }}
                        name="include_column_header"
                      />

                      <Typography className={`${classes.jobTypeLable} ${classes.colorSecondary}`}>
                        <span style={{ color: '#0A0A0A' }}>Note:</span>
                        <i>
                          Turn on this option if the selected sheet contains column header. Column headers are excluded
                          as a part of payload wile exporting to database tables.
                        </i>
                      </Typography>
                    </Grid>
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
        <>
          {shouldUserReAuthorizeSpreadsheet && (
            <div className={classes.authorizeBanner}>
              <Typography>
                We have noticed the connection issue with your spreadsheet. You must re-authorize the google spreadsheet
                connection.
              </Typography>
            </div>
          )}
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText={'Authorize to Google'}
            onSuccess={handleSpreadsheetConnectionSuccess}
            onFailure={handleSpreadsheetConnectionError}
            cookiePolicy={'single_host_origin'}
            scope={googleScopes.join(' ')}
            responseType={'code'}
            accessType={'offline'}
            prompt={'consent'}
          />
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  submitButton: {
    margin: '20px auto',
  },
  jobTypeLable: {
    margin: '0px 0px 5px 0px',
    padding: 0,
    fontSize: 16,
  },
  colorSecondary: {
    color: '#898989',
  },
  authorizeBanner: {
    background: '#eee',
    padding: 16,
    borderRadius: 4,
    textAlign: 'left',
    marginBottom: 16,
    '& p': {
      fontSize: 16,
    },
  },
}));

export default AddGoogleSheetForm;

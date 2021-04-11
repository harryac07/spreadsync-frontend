import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import Button from 'components/common/Button';
import { SingleSelect } from 'react-select-material-ui';
import { Grid, Radio, RadioGroup, FormControlLabel, Switch, Typography } from '@material-ui/core';

import { useJobConfig } from '../context';

interface Props {
  requestType?: 'target' | 'source';
}

const AddGoogleSheetForm: React.FC<Props> = ({ requestType }) => {
  const classes = useStyles();
  const [
    {
      googleSheetLists,
      selectedSpreadSheet,
      spreadSheetConfig,
      isSpreadsheetConfigCreated,
      isSpreadsheetConfigUpdated
    },
    {
      fetchSpreadSheet,
      saveSpreadsheetConfigForJob,
      getSpreadsheetConfigForJob,
      updateSpreadsheetConfigForJob,
      resetState
    }
  ] = useJobConfig();
  const [error, setError] = useState({} as any);
  const [inputObj, setInputObj] = useState({
    spreadsheet_id: '',
    sheet: '',
    range: 'A1',
    enrich_type: 'replace' as 'append' | 'replace', // append or replace
    include_column_header: true
  });

  const { files = [], nextPageToken = '' } = googleSheetLists || {};
  const [sheetsData = {}] = selectedSpreadSheet.filter(({ type }) => type === requestType);

  const [configuredData] = spreadSheetConfig.filter(({ type }) => type === requestType);
  const { sheets = [] } = sheetsData as any;
  const isSheetConfigured = !isEmpty(configuredData);

  useEffect(() => {
    getSpreadsheetConfigForJob(requestType);
  }, []);

  useEffect(() => {
    if (!isEmpty(configuredData)) {
      setInputObj({
        ...inputObj,
        ...{
          spreadsheet_id: configuredData.spreadsheet_id,
          sheet: configuredData.sheet,
          range: configuredData.range,
          enrich_type: configuredData.enrich_type,
          include_column_header: configuredData.include_column_header
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuredData]);

  useEffect(() => {
    if (isSpreadsheetConfigCreated) {
      toast.success(`Spreadsheet configured successfully!`);
      resetState();
    } else if (isSpreadsheetConfigUpdated) {
      toast.success(`Spreadsheet configuration updated successfully!`);
      resetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpreadsheetConfigCreated, isSpreadsheetConfigUpdated]);

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
    const payload = { ...inputObj, type: requestType };
    const errorExists = isError();
    if (!errorExists) {
      if (isSheetConfigured) {
        updateSpreadsheetConfigForJob(configuredData.id, payload);
      } else {
        saveSpreadsheetConfigForJob(payload);
      }
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} sm={4}>
              <Typography className={classes.jobTypeLable}>Select spreadsheet</Typography>
              <SingleSelect
                value={inputObj.spreadsheet_id}
                placeholder="Select spreadsheet"
                options={files.map(file => ({ key: file.id, value: file.id, label: file.name }))}
                helperText="Select the existing Spreadsheet or create new one"
                SelectProps={{
                  isCreatable: true
                }}
                onChange={value => {
                  handleChange({
                    target: { value, name: 'spreadsheet_id' }
                  });
                  fetchSpreadSheet(value, 'target');
                }}
              />
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
                  console.log(e.target.checked);
                  setInputObj({
                    ...inputObj,
                    include_column_header: e.target.checked
                  });
                }}
                name="include_column_header"
              />
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
                  {isSheetConfigured ? 'Update' : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </form>
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
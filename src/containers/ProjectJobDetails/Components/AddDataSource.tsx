import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useJobConfig } from '../context';
import DatabaseForm from './databaseForm';
import APIEndpointForm from './APIEndpointForm';
import SpreadSheetForm from './AddGoogleSheetForm';

type Props = {
  markStepCompleted?: () => void;
};

const DataConnector: React.FC<Props> = ({ markStepCompleted }) => {
  // const classes = useStyles();
  const [{ currentJob }, { hasPermission }] = useJobConfig() || [];
  const dataSource = currentJob?.data_source;

  const { is_data_source_configured } = currentJob || {};

  useEffect(() => {
    if (is_data_source_configured) {
      markStepCompleted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_data_source_configured]);

  const isJobUpdateOrCreateDisabled = !hasPermission(['job_all', 'job_write']);

  return (
    <div>
      {/* render data source component based on datasource type */}
      {dataSource === 'database' && <DatabaseForm isDisabled={isJobUpdateOrCreateDisabled} requestType="source" />}
      {dataSource === 'api' && <APIEndpointForm isDisabled={isJobUpdateOrCreateDisabled} requestType="source" />}
      {dataSource === 'spreadsheet' && (
        <SpreadSheetForm isDisabled={isJobUpdateOrCreateDisabled} requestType="source" />
      )}
    </div>
  );
};

export default DataConnector;

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}));

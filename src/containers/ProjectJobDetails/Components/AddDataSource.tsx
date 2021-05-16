import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useJobConfig } from '../context';
import DatabaseForm from './databaseForm';
import SpreadSheetForm from './AddGoogleSheetForm';

type Props = {
  markStepCompleted?: () => void;
};

const DataConnector: React.FC<Props> = ({ markStepCompleted }) => {
  // const classes = useStyles();
  const [{ currentJob }] = useJobConfig() || [];
  const dataSource = currentJob?.data_source;
  const { is_data_source_configured } = currentJob || {};

  useEffect(() => {
    if (is_data_source_configured) {
      markStepCompleted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_data_source_configured]);

  return (
    <div>
      {/* render data source component based on datasource type */}
      {dataSource === 'database' && <DatabaseForm requestType="source" />}
      {dataSource === 'spreadsheet' && <SpreadSheetForm requestType="source" />}
    </div>
  );
};

export default DataConnector;

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 18,
    fontWeight: 'bold'
  }
}));

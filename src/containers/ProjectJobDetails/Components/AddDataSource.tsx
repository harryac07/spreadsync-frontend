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

  return (
    <div>
      {/* render data source component based on datasource type */}
      {dataSource === 'database' && <DatabaseForm requestType="source" markStepCompleted={markStepCompleted} />}
      {dataSource === 'spreadsheet' && (
        <SpreadSheetForm requestType="source" setConfigurationCompleted={markStepCompleted} />
      )}
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

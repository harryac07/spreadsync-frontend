import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useJobConfig } from '../context';
import DatabaseForm from './databaseForm';

type Props = {
  handleSubmit: (reqPayload: any) => void;
  defaultData: any;
  databaseConnectionText: string;
  markStepCompleted?: () => void;
  handleCheckDatabaseConnection?: () => void;
};

const DataConnector: React.FC<Props> = ({
  handleSubmit,
  defaultData,
  markStepCompleted,
  handleCheckDatabaseConnection,
  databaseConnectionText
}) => {
  // const classes = useStyles();
  const [{ currentJob }] = useJobConfig() || [];

  const dataSource = currentJob?.data_source;
  const dataSourceScript = currentJob?.script ?? '';

  useEffect(() => {
    if (dataSourceScript) {
      markStepCompleted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceScript]);

  return (
    <div>
      {/* render data source component based on datasource type */}
      {dataSource === 'database' && (
        <DatabaseForm
          handleSubmit={handleSubmit}
          defaultData={defaultData}
          databaseConnectionText={databaseConnectionText}
          markStepCompleted={markStepCompleted}
          handleCheckDatabaseConnection={handleCheckDatabaseConnection}
        />
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

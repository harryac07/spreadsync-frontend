import React from 'react';
import AddGoogleSheetForm from './AddGoogleSheetForm';
import DatabaseForm from './databaseForm';

type Props = {
  targetConfigurationCompleted: () => void;
  dataTargetType: 'spreadsheet' | 'database';
};
const DataConnector: React.FC<Props> = ({ targetConfigurationCompleted, dataTargetType }) => {
  return (
    <div>
      {dataTargetType === 'spreadsheet' && (
        <AddGoogleSheetForm requestType="target" setConfigurationCompleted={targetConfigurationCompleted} />
      )}

      {dataTargetType === 'database' && (
        <DatabaseForm requestType="target" markStepCompleted={targetConfigurationCompleted} />
      )}
      <div />
    </div>
  );
};

export default DataConnector;

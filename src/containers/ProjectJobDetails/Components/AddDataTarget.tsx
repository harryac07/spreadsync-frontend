import React from 'react';
import AddGoogleSheetForm from './AddGoogleSheetForm';

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
      <div />
    </div>
  );
};

export default DataConnector;

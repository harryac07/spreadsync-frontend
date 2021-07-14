import React, { useEffect } from 'react';
import AddGoogleSheetForm from './AddGoogleSheetForm';
import DatabaseForm from './databaseForm';
import { useJobConfig } from '../context';

type Props = {
  targetConfigurationCompleted: () => void;
  dataTargetType: 'spreadsheet' | 'database';
};
const DataConnector: React.FC<Props> = ({ targetConfigurationCompleted, dataTargetType }) => {
  const [{ currentJob }, { hasPermission }] = useJobConfig() || [];
  const { is_data_target_configured } = currentJob || {};

  useEffect(() => {
    if (is_data_target_configured) {
      targetConfigurationCompleted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_data_target_configured]);

  const isJobUpdateOrCreateDisabled = !hasPermission(['job_all', 'job_write']);

  return (
    <div>
      {dataTargetType === 'spreadsheet' && (
        <AddGoogleSheetForm isDisabled={isJobUpdateOrCreateDisabled} requestType="target" />
      )}
      {dataTargetType === 'database' && <DatabaseForm isDisabled={isJobUpdateOrCreateDisabled} requestType="target" />}
      <div />
    </div>
  );
};

export default DataConnector;

import React, { useState } from 'react';
import Button from 'components/common/Button';
import DatabaseForm from './DatabaseSourceForm';
import Modal from 'components/common/ModalWithButton';

const DataConnector = (props) => {
  const [isModelOpen, handleModelOpen] = useState(false);
  const { data_source, handleSubmit } = props;

  let connectionText = '';
  switch (data_source) {
    case 'database':
      connectionText = 'Connect to database';
      break;
    default:
      connectionText = 'Data source connection';
  }

  const renderDatabaseSource = () => {
    return (
      <Button color="default" onClick={() => handleModelOpen(true)}>
        <a type="button">{connectionText}</a>
      </Button>
    );
  };

  return (
    <div>
      {data_source === 'database' ? renderDatabaseSource() : null}
      {isModelOpen && data_source === 'database' ? (
        <Modal autoClose={false} modalTitle={'Create Project'} modalWidth={'40%'}>
          <DatabaseForm
            cancelSubmit={(data) => {
              handleModelOpen(data);
            }}
            handleSubmit={handleSubmit}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default DataConnector;

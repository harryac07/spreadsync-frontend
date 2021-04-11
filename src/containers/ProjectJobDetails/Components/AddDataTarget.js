import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GOOGLE_CLIENT_ID } from 'env';
import AddGoogleSheetForm from './AddGoogleSheetForm';

const DataConnector = ({ currentSocialAuth, handleSubmit, ...props }) => {
  const handleSuccess = response => {
    const code = response?.code ?? '';
    if (code) {
      handleSubmit(code);
    }
  };
  const handleError = response => {
    const error = response?.error ?? '';
    if (error) {
      alert(error);
    }
  };

  return (
    <div>
      {currentSocialAuth ? (
        <div>
          <h3>{'Connected to ' + currentSocialAuth?.social_name} </h3>
          <br />
          <AddGoogleSheetForm requestType="target" />
        </div>
      ) : (
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText={'Authorize to Google'}
          onSuccess={handleSuccess}
          onFailure={handleError}
          cookiePolicy={'single_host_origin'}
          scope={[
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/spreadsheets'
          ].join(' ')}
          responseType={'code'}
          accessType={'offline'}
          prompt={'consent'}
        />
      )}
    </div>
  );
};

export default DataConnector;

import React, { useState } from 'react';
import Button from 'components/common/Button';
import { Link } from 'react-router-dom';
import * as queryString from 'query-string';

const DataConnector = props => {
  const { data_source } = props;

  let authorizationLink = '';
  let connectionText = '';
  switch (data_source) {
    case 'spreadsheet':
      const stringifiedParams = queryString.stringify({
        client_id: '831743571895-h86cvf32nr6etbhdqvheke0tco5k6i10.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/projects',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/spreadsheets'
        ].join(' '),
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent'
      });
      authorizationLink = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
      connectionText = 'Authorize to Google';
      break;
    default:
      authorizationLink = '';
      connectionText = 'Data connection';
  }

  const trackRedirectLink = () => {
    localStorage.setItem('redirect_to', 'http://localhost:3000/projects/c19cc6da-6679-49e5-a48d-31e3affc9d7a/job/new');
  };

  return (
    <div>
      <Button color="default" onClick={trackRedirectLink}>
        <a href={authorizationLink} type="button">
          {connectionText}
        </a>
      </Button>
    </div>
  );
};

export default DataConnector;

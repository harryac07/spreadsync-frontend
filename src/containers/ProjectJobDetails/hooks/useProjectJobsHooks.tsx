import { useState, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { API_URL } from 'env';

import { selectAllJobsByProject } from '../selector';
import { isEmpty, uniqBy } from 'lodash';

export interface NewJobPayloadProps {
  name: string;
  type: string;
  unit: string;
  value: number;
  data_source: string;
  data_target: string;
  description: string;
  project: string;
}

type SocialAuthTypes = 'target' | 'source';
type SocialNameTypes = 'google';

type SpreadhSheetPayloadType = { type: SocialAuthTypes; spreadsheetId: string; sheets: any[] };
export type State = {
  currentJob: any;
  currentJobDataSource: any;
  currentSocialAuth: { id: string; name: string }[];
  configuredSpreadsheetData: SpreadhSheetPayloadType[];
  googleSheetLists: any;
  isNewJobCreated: boolean;
  isJobUpdated: boolean;
  isNewDataSourceCreated: boolean;
  isDataSourceUpdated: boolean;
  error?: any;
  currentProject?: any;
};
export type Dispatch = {
  createNewJob: (newjobPayload: NewJobPayloadProps) => Promise<void>;
  updateNewJob: (jobId: string, newjobPayload: NewJobPayloadProps) => Promise<void>;
  createDataSource: (dataSourcePayload: any) => Promise<void>;
  updateDataSource: (dataSourceId: string, dataSourcePayload: any) => Promise<void>;
  resetState: () => void;
  fetchSpreadSheet: (spreadsheetId: string, type: SocialAuthTypes) => void;
  saveSocialAuth: (authCode: string, type: SocialAuthTypes, social_name: SocialNameTypes) => Promise<void>;
};

export default function useProjectJobsHooks(jobId: string = ''): [State, Dispatch] {
  const actions = {
    LOADING: 'LOADING',
    SET_CURRENT_JOB: 'SET_CURRENT_JOB',
    CREATE_NEW_JOB: 'CREATE_NEW_JOB',
    UPDATE_JOB: 'UPDATE_JOB',
    CREATE_DATA_SOURCE: 'CREATE_DATA_SOURCE',
    SET_DATA_SOURCE: 'SET_DATA_SOURCE',
    UPDATE_DATA_SOURCE: 'UPDATE_DATA_SOURCE',
    SET_SOCIAL_AUTH: 'SET_SOCIAL_AUTH',
    SET_GOOGLE_SHEET_LIST: 'SET_GOOGLE_SHEET_LIST',
    SET_SPREADSHEET: 'SET_SPREADSHEET',
    RESET_BOOLEAN_STATES: 'RESET_BOOLEAN_STATES'
  };
  const initialState: State = {
    currentJob: {},
    currentJobDataSource: {},
    currentSocialAuth: [],
    googleSheetLists: {},
    isNewJobCreated: false,
    isJobUpdated: false,
    isNewDataSourceCreated: false,
    isDataSourceUpdated: false,
    configuredSpreadsheetData: [],
    error: {}
  };
  const reducer = (state: State, action: any) => {
    switch (action.type) {
      case 'SET_CURRENT_JOB':
        return {
          ...state,
          currentJob: action.payload
        };
      case 'CREATE_NEW_JOB':
        return {
          ...state,
          isNewJobCreated: true
        };
      case 'UPDATE_JOB':
        return {
          ...state,
          isJobUpdated: true
        };
      case 'SET_DATA_SOURCE':
        return {
          ...state,
          currentJobDataSource: action.payload
        };
      case 'CREATE_DATA_SOURCE':
        return {
          ...state,
          isNewDataSourceCreated: true
        };
      case 'UPDATE_DATA_SOURCE':
        return {
          ...state,
          isDataSourceUpdated: true
        };
      case 'SET_SOCIAL_AUTH':
        return {
          ...state,
          currentSocialAuth: action.payload
        };
      case 'SET_GOOGLE_SHEET_LIST':
        return {
          ...state,
          googleSheetLists: action.payload
        };
      case 'SET_SPREADSHEET':
        const filterSpreadSheetByType = state.configuredSpreadsheetData.filter(
          ({ type }) => type !== action?.payload?.type
        );
        const uniqueSheetPayload = uniqBy([...filterSpreadSheetByType, action.payload], 'type');
        return {
          ...state,
          configuredSpreadsheetData: uniqueSheetPayload
        };
      case 'RESET_BOOLEAN_STATES':
        return {
          ...state,
          isNewJobCreated: false,
          isJobUpdated: false,
          isNewDataSourceCreated: false,
          isDataSourceUpdated: false
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const { currentProject = {}, job = {} } = useSelector((state: any) => {
    return {
      currentProject: state.projectDetail.project[0] || {},
      job: state.projectDetail.jobs.find(each => each.id === jobId)
    };
  });

  useEffect(() => {
    try {
      if (isEmpty(job) && jobId) {
        fetchCurrentJob();
      } else {
        dispatch({ type: actions.SET_CURRENT_JOB, payload: job });
      }
    } catch (e) {
      console.error(e.stack);
    }
  }, []);

  useEffect(() => {
    /* fetch job details */
    try {
      if (jobId) {
        fetchCurrentJobDataSource();
        getSocialAuthByJobId();
        fetchAllGoogleSheetsForJob();
      }
    } catch (e) {
      console.error(e.stack);
    }
  }, []);

  const fetchCurrentJob = async (id = '') => {
    const response = await axios.get(`${API_URL}/jobs/${id || jobId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    const [job] = response?.data ?? [];
    dispatch({ type: actions.SET_CURRENT_JOB, payload: job });
  };

  const fetchCurrentJobDataSource = async () => {
    const response = await axios.get(`${API_URL}/jobs/${jobId}/datasource/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    const [dataSource] = response?.data ?? [];
    dispatch({ type: actions.SET_DATA_SOURCE, payload: dataSource });
  };

  const createNewJob = async (reqPayload: NewJobPayloadProps) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      fetchCurrentJob(response.data[0].id);
      dispatch({ type: actions.CREATE_NEW_JOB });
    } catch (e) {
      console.error('createNewJob: ', e.stack);
    }
  };

  const updateNewJob = async (jobId: string, reqPayload: NewJobPayloadProps) => {
    try {
      await axios.patch(`${API_URL}/jobs/${jobId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      dispatch({ type: actions.UPDATE_JOB });
      fetchCurrentJob();
    } catch (e) {
      console.error(': (newjobPayload:NewJobPayloadProps)=> Promise<void>;: ', e.stack);
    }
  };

  const createDataSource = async (reqPayload: any) => {
    try {
      await axios.post(`${API_URL}/jobs/${jobId}/datasource/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      dispatch({ type: actions.CREATE_DATA_SOURCE });
      fetchCurrentJobDataSource();
    } catch (e) {
      console.error('createDataSource: ', e.stack);
    }
  };

  const updateDataSource = async (dataSourceId: string, reqPayload: any) => {
    try {
      await axios.patch(`${API_URL}/jobs/${jobId}/datasource/${dataSourceId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      dispatch({ type: actions.UPDATE_DATA_SOURCE });
      fetchCurrentJobDataSource();
    } catch (e) {
      console.error('updateDataSource: ', e.stack);
    }
  };

  const getSocialAuthByJobId = async (social_name: SocialNameTypes = 'google') => {
    try {
      const response = await axios.get(`${API_URL}/auth/social/${social_name}/job/${jobId}`, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      const socialAuth = response?.data ?? [];
      dispatch({ type: actions.SET_SOCIAL_AUTH, payload: socialAuth });
    } catch (e) {
      console.error('getSocialAuthByJobId: ', e.stack);
    }
  };
  const saveSocialAuth = async (
    authCode: string,
    type: SocialAuthTypes = 'target',
    social_name: SocialNameTypes = 'google'
  ) => {
    try {
      const reqPayload = {
        authCode,
        jobId,
        type
      };
      await axios.post(`${API_URL}/auth/social/${social_name}/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      getSocialAuthByJobId(social_name);
    } catch (e) {
      console.error('saveSocialAuth ', e.stack);
    }
  };

  const fetchAllGoogleSheetsForJob = async () => {
    const response = await axios.get(`${API_URL}/sheets/list/job/${jobId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    dispatch({ type: actions.SET_GOOGLE_SHEET_LIST, payload: response.data });
    // res?.data?.files ?? []; res.data.nextPageToken
  };

  const fetchSpreadSheet = async (spreadsheetId: string, type: SocialAuthTypes = 'target') => {
    if (!spreadsheetId) {
      throw new Error('Spreadsheet id is required');
    }
    const response = await axios.get(`${API_URL}/sheets/${spreadsheetId}/job/${jobId}/?data_type=${type}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    dispatch({
      type: actions.SET_SPREADSHEET,
      payload: {
        sheets: response?.data?.sheets ?? [],
        spreadsheetId: spreadsheetId,
        type: type
      } as SpreadhSheetPayloadType
    });
    // res?.data?.files ?? []; res.data.nextPageToken
  };

  const resetState = () => {
    dispatch({ type: actions.RESET_BOOLEAN_STATES });
  };

  return [
    { ...state, currentProject },
    { createNewJob, updateNewJob, createDataSource, updateDataSource, resetState, saveSocialAuth, fetchSpreadSheet }
  ];
}

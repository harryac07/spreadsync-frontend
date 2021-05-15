import { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from 'env';
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
  script?: string;

  is_data_source_configured?: boolean;
  is_data_target_configured?: boolean;
}
export interface JobUpdatePayloadProps {
  name?: string;
  type?: string;
  unit?: string;
  value?: number;
  data_source?: string;
  data_target?: string;
  description?: string;
  project?: string;
  script?: string;

  is_data_source_configured?: boolean;
  is_data_target_configured?: boolean;
}

type SocialAuthTypes = 'target' | 'source';
type SocialNameTypes = 'google';

type SelectedSpreadSheetTypes = { type: SocialAuthTypes; spreadsheetId: string; sheets: any[] };
type SaveSpreadsheetConfigForJobTypes = {
  include_column_header: boolean;
  enrich_type: 'append' | 'replace';
  range: string;
  sheet: string;
  spreadsheet_id: string;
  type: 'source' | 'target';
};

export type State = {
  currentJob: any;
  currentJobDataSource: any;
  currentSocialAuth: { id: string; name: string; type?: string }[];
  selectedSpreadSheet: SelectedSpreadSheetTypes[];
  spreadSheetConfig: any[];
  googleSheetLists: any;
  isNewJobCreated: boolean;
  error?: any;
  currentProject?: any;
  currentManualJobRunning: string;
  isLoading?: boolean;
};
export type Dispatch = {
  createNewJob: (newjobPayload: NewJobPayloadProps) => Promise<void>;
  updateNewJob: (updatejobPayload: JobUpdatePayloadProps) => Promise<void>;
  createDataSource: (dataSourcePayload: any) => Promise<void>;
  updateDataSource: (dataSourceId: string, dataSourcePayload: any) => Promise<void>;
  checkDatabaseConnection: (dataSourceId: string) => Promise<boolean | void>;
  resetState: () => void;
  fetchSpreadSheet: (spreadsheetId: string, type: SocialAuthTypes) => void;
  saveSocialAuth: (authCode: string, type: SocialAuthTypes, social_name: SocialNameTypes) => Promise<void>;
  saveSpreadsheetConfigForJob: (reqPayload: SaveSpreadsheetConfigForJobTypes) => Promise<void>;
  getSpreadsheetConfigForJob: (type: 'source' | 'target') => Promise<void>;
  updateSpreadsheetConfigForJob: (configId: string, reqPayload: any) => Promise<void>;
  createNewSpreadSheet: (spreadsheetName: string, type: 'source' | 'target') => Promise<void>;
  runExportJobManually: () => Promise<void>;
};

const actions = {
  LOADING: 'LOADING',
  SET_CURRENT_JOB: 'SET_CURRENT_JOB',
  CREATE_NEW_JOB: 'CREATE_NEW_JOB',
  SET_DATA_SOURCE: 'SET_DATA_SOURCE',
  SET_SOCIAL_AUTH: 'SET_SOCIAL_AUTH',
  SET_GOOGLE_SHEET_LIST: 'SET_GOOGLE_SHEET_LIST',
  SET_SPREADSHEET: 'SET_SPREADSHEET',
  SET_SPREAD_SHEET_CONFIG: 'SET_SPREAD_SHEET_CONFIG',
  SET_CURRENT_MANUAL_JOB_RUNNING: 'SET_CURRENT_MANUAL_JOB_RUNNING',
  RESET_BOOLEAN_STATES: 'RESET_BOOLEAN_STATES'
};
const initialState: State = {
  currentJob: {},
  currentJobDataSource: {},
  currentSocialAuth: [],
  googleSheetLists: {},
  isNewJobCreated: false,
  selectedSpreadSheet: [],
  spreadSheetConfig: [],
  error: {},
  isLoading: false,
  currentManualJobRunning: ''
};

const reducer = (state: State, action: any) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: true
      };
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
    case 'SET_DATA_SOURCE':
      return {
        ...state,
        currentJobDataSource: action.payload
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
      const filterSpreadSheetByType = state.selectedSpreadSheet.filter(({ type }) => type !== action?.payload?.type);
      const uniqueSheetPayload = uniqBy([...filterSpreadSheetByType, action.payload], 'type');
      return {
        ...state,
        selectedSpreadSheet: uniqueSheetPayload
      };
    case 'SET_SPREAD_SHEET_CONFIG':
      return {
        ...state,
        spreadSheetConfig: action.payload
      };
    case 'SET_CURRENT_MANUAL_JOB_RUNNING':
      return {
        ...state,
        currentManualJobRunning: action.payload
      };
    case 'RESET_BOOLEAN_STATES':
      return {
        ...state,
        isNewJobCreated: false,
        isLoading: false
      };
    default:
      return {
        ...state
      };
  }
};

export default function useProjectJobsHooks(jobId: string): [State, Dispatch] {
  const [state, dispatch] = useReducer(reducer, { ...initialState });
  const { currentProject = {}, job = {} } = useSelector((states: any) => {
    return {
      currentProject: states.projectDetail.project[0] || {},
      job: states.projectDetail.jobs.find(each => each.id === jobId)
    };
  });

  useEffect(() => {
    if (jobId) {
      try {
        if (isEmpty(job)) {
          fetchCurrentJob();
        } else {
          dispatch({ type: actions.SET_CURRENT_JOB, payload: job });
        }
      } catch (e) {
        console.error(e.stack);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

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
      await fetchCurrentJob(response.data[0].id);
      dispatch({ type: actions.CREATE_NEW_JOB });
      toast.success(`Job created successfully!`);
    } catch (e) {
      console.error('createNewJob: ', e.stack);
    }
  };

  const updateNewJob = async (reqPayload: JobUpdatePayloadProps) => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      await axios.patch(`${API_URL}/jobs/${jobId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      await fetchCurrentJob();
      toast.success(`Job updated successfully!`);
    } catch (e) {
      console.error(': (newjobPayload:NewJobPayloadProps)=> Promise<void>;: ', e.stack);
    }
  };

  const createDataSource = async (reqPayload: any) => {
    try {
      await axios.post(`${API_URL}/jobs/${jobId}/datasource/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Data source created successfully!`);
      await fetchCurrentJobDataSource();
    } catch (e) {
      console.error('createDataSource: ', e.stack);
    }
  };

  const updateDataSource = async (dataSourceId: string, reqPayload: any) => {
    try {
      await axios.patch(`${API_URL}/jobs/${jobId}/datasource/${dataSourceId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Data source updated successfully!`);
      await fetchCurrentJobDataSource();
    } catch (e) {
      console.error('updateDataSource: ', e.stack);
    }
  };

  const checkDatabaseConnection = async (dataSourceId: string) => {
    try {
      await axios.post(
        `${API_URL}/jobs/${jobId}/datasource/${dataSourceId}/connection-check`,
        {},
        {
          headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
        }
      );
      return true;
    } catch (e) {
      return false;
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
      await getSocialAuthByJobId(social_name);
      await fetchAllGoogleSheetsForJob();
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
      } as SelectedSpreadSheetTypes
    });
  };

  const createNewSpreadSheet = async (spreadSheetName: string, type: SocialAuthTypes = 'target') => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      const reqPayload = {
        spreadsheet_name: spreadSheetName
      };
      dispatch({ type: actions.LOADING });
      const response = await axios.post(`${API_URL}/sheets/create/job/${jobId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      const sheetId = response?.data?.spreadsheet_id ?? '';
      dispatch({ type: actions.RESET_BOOLEAN_STATES });
      await fetchAllGoogleSheetsForJob();
      if (sheetId) {
        await fetchSpreadSheet(sheetId, type);
      }
    } catch (e) {
      console.error('createNewSpreadSheet ', e.stack);
    }
  };

  const saveSpreadsheetConfigForJob = async (reqPayload: SaveSpreadsheetConfigForJobTypes) => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      await axios.post(`${API_URL}/jobs/${jobId}/sheets/config`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      await getSpreadsheetConfigForJob(reqPayload.type);
      toast.success(`Spreadsheet configured successfully!`);
    } catch (e) {
      console.error('saveSpreadsheetConfigForJob ', e.stack);
    }
  };

  const updateSpreadsheetConfigForJob = async (configId: string, reqPayload: any) => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      if (!configId) {
        throw new Error('Spreadsheet config id is required!');
      }
      await axios.patch(`${API_URL}/jobs/${jobId}/sheets/config/${configId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      await getSpreadsheetConfigForJob(reqPayload.type);
      toast.success(`Spreadsheet configuration updated successfully!`);
    } catch (e) {
      console.error('updateSpreadsheetConfigForJob ', e.stack);
    }
  };

  const getSpreadsheetConfigForJob = async (type?: SocialAuthTypes) => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      const response = await axios.get(`${API_URL}/jobs/${jobId}/sheets/config/?type=${type}`, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      dispatch({
        type: actions.SET_SPREAD_SHEET_CONFIG,
        payload: response?.data ?? []
      });
      /* fetch spreadsheet */
      const [spreadsheetResponse] = response?.data;
      if (type && !isEmpty(spreadsheetResponse)) {
        fetchSpreadSheet(spreadsheetResponse?.spreadsheet_id, type);
      }
    } catch (e) {
      console.error('saveSpreadsheetConfigForJob ', e.stack);
    }
  };

  const runExportJobManually = async () => {
    try {
      dispatch({
        type: actions.SET_CURRENT_MANUAL_JOB_RUNNING,
        payload: jobId
      });
      await axios.post(
        `${API_URL}/jobs/${jobId}/export`,
        {},
        {
          headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
        }
      );
      dispatch({
        type: actions.SET_CURRENT_MANUAL_JOB_RUNNING,
        payload: ''
      });
      toast.success(`Data export job completed successfully!`);
    } catch (e) {
      toast.error(`Export failed! ${e?.response?.data?.message ?? e?.message}`);
      console.error('runExportJobManually ', e?.response?.data);
      dispatch({
        type: actions.SET_CURRENT_MANUAL_JOB_RUNNING,
        payload: ''
      });
    }
  };

  const resetState = () => {
    dispatch({ type: actions.RESET_BOOLEAN_STATES });
  };
  return [
    { ...state, currentProject },
    {
      createNewJob,
      updateNewJob,
      createDataSource,
      updateDataSource,
      checkDatabaseConnection,
      resetState,
      saveSocialAuth,
      fetchSpreadSheet,
      saveSpreadsheetConfigForJob,
      getSpreadsheetConfigForJob,
      updateSpreadsheetConfigForJob,
      createNewSpreadSheet,
      runExportJobManually
    }
  ];
}

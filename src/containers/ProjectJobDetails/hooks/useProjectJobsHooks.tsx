import { useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from 'env';
import { isEmpty, uniqBy, intersection } from 'lodash';

import { createApiConfig, updateApiConfig } from '../utils/api';
import { getPermissionsForCurrentProject } from 'store/selectors';
import { fetchProjectById } from 'containers/ProjectDetail/action';

export interface NewJobPayloadProps {
  name: string;
  type: string;
  unit: string;
  value: number;
  data_source: string;
  data_target: string;
  description: string;
  project: string;
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
  is_data_source_configured?: boolean;
  is_data_target_configured?: boolean;
}

export type APIConfigPayloads = {
  job_id: string;
  method: 'GET' | 'POST';
  endpoint: string;
  params: string;
  headers: string;
  body: string;
  type: 'source' | 'target';
};

type SocialAuthTypes = 'target' | 'source';
type SocialNameTypes = 'google';

type SelectedSpreadSheetTypes = {
  type: SocialAuthTypes;
  spreadsheetId: string;
  sheets: any[];
  spreadsheetName?: string;
};
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
  tableList: any;
  currentSocialAuth: { id: string; name: string; type?: string }[];
  selectedSpreadSheet: SelectedSpreadSheetTypes[];
  spreadSheetConfig: any[];
  apiConfig: any[];
  googleSheetLists: { files: any; type: 'source' | 'target'; nextPageToken?: string }[];
  isNewJobCreated: boolean;
  error?: any;
  currentProject?: any;
  permissions?: string;
  currentManualJobRunning: string;
  isLoading?: boolean;
};
export type Dispatch = {
  createNewJob: (newjobPayload: NewJobPayloadProps) => Promise<void>;
  updateNewJob: (updatejobPayload: JobUpdatePayloadProps) => Promise<void>;
  createDataSource: (dataSourcePayload: any) => Promise<void>;
  cloneExistingJob: () => Promise<void>;
  updateDataSource: (dataSourceId: string, dataSourcePayload: any) => Promise<void>;
  checkDatabaseConnection: (dataSourceId: string) => Promise<boolean | void>;
  listDatabaseTable: (dataSourceId: string) => Promise<void>;
  resetState: () => void;
  fetchAllGoogleSheetsForJob: (type: SocialAuthTypes, nextPageToken?: string) => Promise<void>;
  fetchSpreadSheet: (spreadsheetId: string, type: SocialAuthTypes) => void;
  saveSocialAuth: (authCode: string, type: SocialAuthTypes, social_name: SocialNameTypes) => Promise<void>;
  saveSpreadsheetConfigForJob: (reqPayload: SaveSpreadsheetConfigForJobTypes) => Promise<void>;
  getSpreadsheetConfigForJob: (type: 'source' | 'target') => Promise<void>;
  updateSpreadsheetConfigForJob: (configId: string, reqPayload: any) => Promise<void>;
  createNewSpreadSheet: (spreadsheetName: string, type: 'source' | 'target') => Promise<void>;
  runExportJobManually: () => Promise<void>;
  createApiConfigForJob: (reqPayload: APIConfigPayloads) => Promise<void>;
  updateApiConfigForJob: (id: string, reqPayload: APIConfigPayloads) => Promise<void>;
  getApiConfigForJob: () => Promise<void>;
  hasPermission: (permission: string | string[]) => boolean;
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
  SET_API_CONFIG: 'SET_API_CONFIG',
  SET_CURRENT_MANUAL_JOB_RUNNING: 'SET_CURRENT_MANUAL_JOB_RUNNING',
  RESET_BOOLEAN_STATES: 'RESET_BOOLEAN_STATES',
  SET_DATA_SOURCE_TABLE_LIST: 'SET_DATA_SOURCE_TABLE_LIST',
  SET_ERROR: 'SET_ERROR',
};
const initialState: State = {
  currentJob: {},
  currentJobDataSource: [],
  currentSocialAuth: [],
  googleSheetLists: [],
  isNewJobCreated: false,
  selectedSpreadSheet: [],
  spreadSheetConfig: [],
  apiConfig: [],
  error: {},
  isLoading: false,
  currentManualJobRunning: '',
  tableList: {},
};

const reducer = (state: State, action: any) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'SET_CURRENT_JOB':
      return {
        ...state,
        currentJob: action.payload,
      };
    case 'CREATE_NEW_JOB':
      return {
        ...state,
        isNewJobCreated: true,
      };
    case 'SET_DATA_SOURCE':
      return {
        ...state,
        currentJobDataSource: action.payload,
      };
    case 'SET_DATA_SOURCE_TABLE_LIST':
      return {
        ...state,
        tableList: {
          ...state.tableList,
          [action.id]: action.payload,
        },
      };
    case 'SET_SOCIAL_AUTH':
      return {
        ...state,
        currentSocialAuth: action.payload,
      };
    case 'SET_GOOGLE_SHEET_LIST':
      const filterSheetListsByType = state.googleSheetLists.filter(({ type }) => type !== action?.payload?.type);

      // merge array of spreadsheets preventing duplicate
      const { usePreviousTrackingToken = false } = action || {};

      const previousGoogleSheet = state.googleSheetLists.find(({ type }) => type === action?.payload?.type);

      let nextPageToken = action.payload?.nextPageToken ?? '';
      if (usePreviousTrackingToken) {
        nextPageToken = previousGoogleSheet?.nextPageToken ?? '';
      }

      const mergedPayload = {
        ...action.payload,
        files: uniqBy([...(previousGoogleSheet?.files ?? []), ...(action.payload?.files ?? [])], 'id'),
        nextPageToken: nextPageToken,
      };

      const uniqueSheetsPayload = uniqBy([...filterSheetListsByType, mergedPayload], 'type') as {
        files: any;
        type: 'target' | 'source';
        nextPageToken?: string;
      }[];

      return {
        ...state,
        googleSheetLists: uniqueSheetsPayload,
      };
    case 'SET_SPREADSHEET':
      const filterSpreadSheetByType = state.selectedSpreadSheet.filter(({ type }) => type !== action?.payload?.type);
      const uniqueSheetPayload = uniqBy([...filterSpreadSheetByType, action.payload], 'type');
      return {
        ...state,
        selectedSpreadSheet: uniqueSheetPayload,
      };
    case 'SET_SPREAD_SHEET_CONFIG':
      return {
        ...state,
        spreadSheetConfig: action.payload,
      };
    case 'SET_API_CONFIG':
      return {
        ...state,
        apiConfig: action.payload,
      };
    case 'SET_CURRENT_MANUAL_JOB_RUNNING':
      return {
        ...state,
        currentManualJobRunning: action.payload,
      };
    case 'RESET_BOOLEAN_STATES':
      return {
        ...state,
        isNewJobCreated: false,
        isLoading: false,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.key]: action.payload.error,
        },
      };
    default:
      return {
        ...state,
      };
  }
};

export default function useProjectJobsHooks(jobId: string): [State, Dispatch] {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    currentProject = {},
    job = {},
    permissions = '',
  } = useSelector((states: any) => {
    return {
      currentProject: states.projectDetail.project[0] || {},
      job: states.projectDetail.jobs.find((each) => each.id === jobId),
      permissions: getPermissionsForCurrentProject(states),
    };
  });
  const storeDispatch = useDispatch();

  useEffect(() => {
    if (jobId) {
      try {
        if (isEmpty(job) || isEmpty(state.currentJob)) {
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
      }
    } catch (e) {
      console.error(e.stack);
    }
  }, []);

  const fetchCurrentJob = async (id = '') => {
    const response = await axios.get(`${API_URL}/jobs/${id || jobId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    });
    const [job] = response?.data ?? [];
    dispatch({ type: actions.SET_CURRENT_JOB, payload: job });
  };

  const fetchCurrentJobDataSource = async () => {
    const response = await axios.get(`${API_URL}/jobs/${jobId}/datasource/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    });
    const dataSource = response?.data ?? [];
    dispatch({ type: actions.SET_DATA_SOURCE, payload: dataSource });
  };

  const createNewJob = async (reqPayload: NewJobPayloadProps) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
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
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      });
      await fetchCurrentJob();

      const isDataSourceUpdated =
        (reqPayload.is_data_source_configured || reqPayload.is_data_target_configured) && !reqPayload.name;
      if (!isDataSourceUpdated) {
        toast.success(`Job updated successfully!`);
      }
    } catch (e) {
      console.error(': (newjobPayload:NewJobPayloadProps)=> Promise<void>;: ', e.stack);
    }
  };

  const cloneExistingJob = async () => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      await axios.post(
        `${API_URL}/jobs/${jobId}/clone`,
        {},
        {
          headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
        }
      );
      storeDispatch(fetchProjectById(currentProject.id));
      toast.success(`Job cloned successfully!`);
    } catch (e) {
      toast.error(`Job cloned failed! ${e?.message}`);
    }
  };

  const createDataSource = async (reqPayload: any) => {
    try {
      await axios.post(`${API_URL}/jobs/${jobId}/datasource/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
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
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
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
          headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
        }
      );
      return true;
    } catch (e) {
      return false;
    }
  };

  const listDatabaseTable = async (dataSourceId: string) => {
    try {
      const res = await axios.get(`${API_URL}/jobs/${jobId}/datasource/${dataSourceId}/list-table`, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      });
      dispatch({ type: actions.SET_DATA_SOURCE_TABLE_LIST, id: dataSourceId, payload: res.data });
    } catch (e) {
      console.error(e.stack);
    }
  };

  const getSocialAuthByJobId = async (social_name: SocialNameTypes = 'google') => {
    try {
      const response = await axios.get(`${API_URL}/auth/social/${social_name}/job/${jobId}`, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
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
        type,
      };
      await axios.post(`${API_URL}/auth/social/${social_name}/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      });
      await getSocialAuthByJobId(social_name);
      await fetchAllGoogleSheetsForJob(type);

      dispatch({
        type: actions.SET_ERROR,
        payload: {
          key: 'spreadsheet-' + type,
          error: null,
        },
      });
    } catch (e) {
      console.error('saveSocialAuth ', e.stack);
    }
  };

  const fetchAllGoogleSheetsForJob = async (reqType: SocialAuthTypes, nextPageToken = '') => {
    const queryParams = new URLSearchParams({
      reqType,
      nextPageToken,
    });
    try {
      const response = await axios.get(`${API_URL}/sheets/list/job/${jobId}?${queryParams.toString()}`, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      });

      dispatch({ type: actions.SET_GOOGLE_SHEET_LIST, payload: response.data });
      // res?.data?.files ?? []; res.data.nextPageToken
    } catch (e) {
      console.log('error ', e.response);
    }
  };

  const fetchSpreadSheet = async (spreadsheetId: string, type: SocialAuthTypes = 'target') => {
    try {
      if (!spreadsheetId) {
        throw new Error('Spreadsheet id is required');
      }
      const response = await axios.get(`${API_URL}/sheets/${spreadsheetId}/job/${jobId}/?data_type=${type}`, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      });
      dispatch({
        type: actions.SET_SPREADSHEET,
        payload: {
          sheets: response?.data?.sheets ?? [],
          spreadsheetId: spreadsheetId,
          spreadsheetName: response?.data?.properties?.title ?? '',
          type: type,
        } as SelectedSpreadSheetTypes,
      });
      dispatch({
        type: actions.SET_ERROR,
        payload: {
          key: 'spreadsheet-' + type,
          error: null,
        },
      });
    } catch (e) {
      dispatch({
        type: actions.SET_ERROR,
        payload: {
          key: 'spreadsheet-' + type,
          error: e?.response?.data?.message ?? 'Something went wrong!',
        },
      });
    }
  };

  const createNewSpreadSheet = async (spreadSheetName: string, type: SocialAuthTypes) => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      const reqPayload = {
        spreadsheet_name: spreadSheetName,
        type,
      };
      dispatch({ type: actions.LOADING });
      const response = await axios.post(`${API_URL}/sheets/create/job/${jobId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      });
      const sheetId = response?.data?.spreadsheet_id ?? '';
      dispatch({ type: actions.RESET_BOOLEAN_STATES });

      /* Append newly created spreadsheet to the state */
      dispatch({
        type: actions.SET_GOOGLE_SHEET_LIST,
        payload: {
          files: [
            {
              id: sheetId,
              name: spreadSheetName,
            },
          ],
          type: type,
        },
        usePreviousTrackingToken: true,
      });
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
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
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
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
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
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      });
      dispatch({
        type: actions.SET_SPREAD_SHEET_CONFIG,
        payload: response?.data ?? [],
      });
      /* fetch spreadsheet */
      const [spreadsheetResponse] = response?.data?.filter(({ type: reqType }) => reqType === type);
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
        payload: jobId,
      });
      await axios.post(
        `${API_URL}/jobs/${jobId}/export`,
        {},
        {
          headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
        }
      );
      dispatch({
        type: actions.SET_CURRENT_MANUAL_JOB_RUNNING,
        payload: '',
      });
      toast.success(`Data export job completed successfully!`);
    } catch (e) {
      toast.error(`Export failed! ${e?.response?.data?.message ?? e?.message}`);
      console.error('runExportJobManually ', e?.response?.data);
      dispatch({
        type: actions.SET_CURRENT_MANUAL_JOB_RUNNING,
        payload: '',
      });
    }
  };

  const createApiConfigForJob = async (reqPayload: APIConfigPayloads) => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      await createApiConfig(jobId, reqPayload);
      await fetchCurrentJob();
      await getApiConfigForJob();
      toast.success(`API config created successfully!`);
    } catch (e) {
      toast.error(`Creating API config for ${jobId} failed!`);
    }
  };

  const updateApiConfigForJob = async (id: string, reqPayload: APIConfigPayloads) => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      await updateApiConfig(jobId, id, reqPayload);
      await fetchCurrentJob();
      await getApiConfigForJob();
      toast.success(`API config updated successfully!`);
    } catch (e) {
      toast.error(`Creating API config for ${jobId} failed!`);
    }
  };

  const getApiConfigForJob = async () => {
    try {
      if (!jobId) {
        throw new Error('Job id is required!');
      }
      const response = await axios.get(`${API_URL}/jobs/${jobId}/apiconfig/`, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
      });
      dispatch({
        type: actions.SET_API_CONFIG,
        payload: response?.data ?? [],
      });
    } catch (e) {
      console.error('saveSpreadsheetConfigForJob ', e.stack);
    }
  };

  const hasPermission = (permissionToCheck: string | string[]): boolean => {
    if (permissions.includes('admin')) {
      return true;
    }

    if (typeof permissionToCheck === 'string') {
      return permissions.includes(permissionToCheck);
    } else {
      const permissionFound = intersection(permissionToCheck, permissions?.split(','));
      return !!permissionFound?.length;
    }
  };

  const resetState = () => {
    dispatch({ type: actions.RESET_BOOLEAN_STATES });
  };
  return [
    { ...state, currentProject, permissions },
    {
      createNewJob,
      updateNewJob,
      cloneExistingJob,
      createDataSource,
      updateDataSource,
      checkDatabaseConnection,
      listDatabaseTable,
      resetState,
      saveSocialAuth,
      fetchAllGoogleSheetsForJob,
      fetchSpreadSheet,
      saveSpreadsheetConfigForJob,
      getSpreadsheetConfigForJob,
      updateSpreadsheetConfigForJob,
      createNewSpreadSheet,
      runExportJobManually,
      createApiConfigForJob,
      updateApiConfigForJob,
      getApiConfigForJob,
      hasPermission,
    },
  ];
}

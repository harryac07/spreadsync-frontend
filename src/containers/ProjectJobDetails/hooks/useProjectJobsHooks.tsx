import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { API_URL } from 'env';

import { selectAllJobsByProject } from '../selector';
import { createJobSucceed, createJobFailed } from '../action';
import { isEmpty } from 'lodash';

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

export default function useProjectJobsHooks(projectId: string = '', jobId: string = '') {
  const storeDispatch = useDispatch();
  const [newJobPayload, setNewJobPayload] = useState({});
  const [currentJob, setCurrentJob] = useState({});
  const [currentJobDataSource, setCurrentJobDataSource] = useState({});
  const [isNewJobCreated, setIsNewJobCreated] = useState(false);
  const [isNewDataSourceCreated, setIsNewDataSourceCreated] = useState(false);
  const [isJobUpdated, setIsJobUpdated] = useState(false);
  const [isDataSourceUpdated, setIsDataSourceUpdated] = useState(false);

  const { currentProject = {}, job = {} } = useSelector((state: any) => {
    return {
      currentProject: state.projectDetail.project[0] || {},
      job: state.projectDetail.jobs.find(each => each.id === jobId)
    };
  });

  useEffect(() => {
    try {
      if (isEmpty(job) && jobId) {
        fetchCurrentJob().then(data => {
          setCurrentJob(data[0]);
        });
      } else {
        setCurrentJob(job);
      }
    } catch (e) {
      console.log(e.response.data);
    }
  }, []);

  useEffect(() => {
    try {
      if (jobId) {
        fetchCurrentJobDataSource().then(data => {
          setCurrentJobDataSource(data[0]);
        });
      }
    } catch (e) {
      console.log(e.response.data);
    }
  }, []);

  const fetchCurrentJob = async () => {
    const response = await axios.get(`${API_URL}/jobs/${jobId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    return response?.data ?? [];
  };
  const fetchCurrentJobDataSource = async () => {
    const response = await axios.get(`${API_URL}/jobs/${jobId}/datasource/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    return response?.data ?? [];
  };

  const createNewJob = async (reqPayload: NewJobPayloadProps) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      setNewJobPayload(response.data[0]);
      setIsNewJobCreated(true);
      storeDispatch(createJobSucceed(response.data));
    } catch (e) {
      storeDispatch(createJobSucceed(e.response.data));
    }
  };

  const updateNewJob = async (jobId: string, reqPayload: NewJobPayloadProps) => {
    try {
      await axios.patch(`${API_URL}/jobs/${jobId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      setIsJobUpdated(true);
      fetchCurrentJob().then(data => {
        setCurrentJob(data[0]);
      });
    } catch (e) {
      console.log('updateNewJob ', e?.response?.data);
    }
  };

  const createDataSource = async (reqPayload: any) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/${jobId}/datasource/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      setCurrentJobDataSource(response.data[0]);
      setIsNewDataSourceCreated(true);
    } catch (e) {
      console.log('createDataSource ', e?.response?.data);
    }
  };

  const updateDataSource = async (dataSourceId: string, reqPayload: any) => {
    try {
      await axios.patch(`${API_URL}/jobs/${jobId}/datasource/${dataSourceId}`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      setIsDataSourceUpdated(true);
      fetchCurrentJobDataSource().then(data => {
        setCurrentJobDataSource(data[0]);
      });
    } catch (e) {
      console.log('updateDataSource ', e?.response?.data);
    }
  };

  const resetState = () => {
    setIsNewJobCreated(false);
    setIsJobUpdated(false);
    setIsNewDataSourceCreated(false);
    setIsDataSourceUpdated(false);
  };
  return [
    {
      newJobPayload,
      currentJob,
      currentJobDataSource,
      currentProject,
      isNewJobCreated,
      isJobUpdated,
      isNewDataSourceCreated,
      isDataSourceUpdated
    },
    { createNewJob, updateNewJob, createDataSource, updateDataSource, resetState }
  ] as const;
}

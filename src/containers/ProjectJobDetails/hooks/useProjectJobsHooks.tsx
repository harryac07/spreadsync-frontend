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
  const [newDataSourcePayload, setNewDataSourcePayload] = useState({});
  const [currentJob, setCurrentJob] = useState({});
  const [currentJobDataSource, setCurrentJobDataSource] = useState({});

  const { currentProject = {}, job = {} } = useSelector((state: any) => {
    return {
      currentProject: state.projectDetail.project[0] || {},
      job: state.projectDetail.jobs.find(each => each.id === jobId)
    };
  });

  useEffect(() => {
    try {
      if (isEmpty(job) && jobId) {
        const fetchCurrentJob = async () => {
          const response = await axios.get(`${API_URL}/jobs/${jobId}`, {
            headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
          });
          return response?.data ?? [];
        };
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
        const fetchCurrentJobDataSource = async () => {
          const response = await axios.get(`${API_URL}/jobs/${jobId}/datasource/`, {
            headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
          });
          return response?.data ?? [];
        };
        fetchCurrentJobDataSource().then(data => {
          setCurrentJobDataSource(data[0]);
        });
      }
    } catch (e) {
      console.log(e.response.data);
    }
  }, []);

  const createNewJob = async (reqPayload: NewJobPayloadProps) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/`, reqPayload, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      setNewJobPayload(response.data[0]);
      storeDispatch(createJobSucceed(response.data));
    } catch (e) {
      console.log('createNewJobError ', e.response.data);
      storeDispatch(createJobSucceed(e.response.data));
    }
  };

  const createDataSource = async (reqPayload: any) => {
    setNewDataSourcePayload(reqPayload);
  };
  console.log('currentJob ', currentJob);
  return [
    {
      newJobPayload,
      currentJob,
      currentJobDataSource,
      currentProject,
      newDataSourcePayload
    },
    { createNewJob, createDataSource }
  ] as const;
}

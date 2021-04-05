import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { API_URL } from 'env';

import { selectAllJobsByProject } from '../selector';
import { createJobSucceed, createJobFailed } from '../action';

export interface NewJobPayloadProps {
  name: string;
  type: string;
  unit: string;
  value: number;
  data_source: string;
  data_destination: string;
  description: string;
  project: string;
}

export default function useProjectJobsHooks(project: string = '') {
  const { jobs } = useSelector(state => {
    return {
      jobs: selectAllJobsByProject(state)
    };
  });
  const storeDispatch = useDispatch();

  const [newJobPayload, setNewJobPayload] = useState({});
  const [newDataSourcePayload, setNewDataSourcePayload] = useState({});
  // const [newJobPayload, setNewJobPayload] = useState({});

  const createNewJob = async (reqPayload: NewJobPayloadProps) => {
    console.log('creating new job ', reqPayload);
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

  return [
    {
      newJobPayload,
      newDataSourcePayload
    },
    { createNewJob, createDataSource }
  ] as const;
}

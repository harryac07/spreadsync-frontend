import axios from 'axios';
import { API_URL } from 'env';

type SocialAuthTypes = 'target' | 'source';
type SocialNameTypes = 'google';

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



const fetchCurrentJob = async (jobId: string) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}`, {
    headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
  });
  return response?.data ?? [];
};

const createNewJob = async (reqPayload: NewJobPayloadProps) => {
  try {
    await axios.post(`${API_URL}/jobs/`, reqPayload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
  } catch (e) {
    // storeDispatch(createJobSucceed(e.response.data));
  }
};

const fetchCurrentJobDataSource = async (jobId: string) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}/datasource/`, {
    headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
  });
  return response?.data ?? [];
};

const getSocialAuthByJobId = async (social_name: SocialNameTypes = 'google', jobId: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/social/${social_name}/job/${jobId}`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    return response?.data ?? [];
  } catch (e) {
    console.log('getSocialAuthByJobId ', e?.response?.data);
  }
};

const saveSocialAuth = async (
  authCode: string,
  type: SocialAuthTypes = 'target',
  social_name: SocialNameTypes = 'google',
  jobId: string
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
  } catch (e) {
    console.log('saveSocialAuth ', e?.response?.data);
  }
};

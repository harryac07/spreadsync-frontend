import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from 'env';

export const fetchCurrentJob = (id = '') => {
  return axios.get(`${API_URL}/jobs/${id}`, {
    headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
  });
};
export const createApiConfig = async (jobId, reqPayload) => {
  return axios.post(`${API_URL}/jobs/${jobId}/apiconfig/`, reqPayload, {
    headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
  });
};
export const updateApiConfig = async (jobId, configId, reqPayload) => {
  return axios.patch(`${API_URL}/jobs/${jobId}/apiconfig/${configId}/`, reqPayload, {
    headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
  });
};
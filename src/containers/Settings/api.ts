import axios from 'axios';
import { API_URL } from 'env';

type AccountPayload = {
  name: string;
}
type AccountTransferPayload = {
  email: string;
}
export const updateAccount = async (accountId: string, payload: AccountPayload): Promise<any> => {
  return axios
    .patch(`${API_URL}/accounts/${accountId}/`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    });
}

export const deleteAccount = async (accountId: string): Promise<any> => {
  return axios
    .delete(`${API_URL}/accounts/${accountId}/`, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    });
}

export const transferAccount = async (accountId: string, payload: AccountTransferPayload): Promise<any> => {
  return axios
    .post(`${API_URL}/accounts/${accountId}/transfer`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    });
}
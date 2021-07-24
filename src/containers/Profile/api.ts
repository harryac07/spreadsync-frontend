import axios from 'axios';
import { API_URL } from 'env';

type UserPayloadProps = {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  company?: string;
}
type UpdateUserPasswordProps = {
  email: string;
  password: string;
  new_password: string;
  repeated_new_password: string;
}
export const updateUserById = (userId: string, payload: UserPayloadProps): Promise<any> => {
  return axios
    .patch(`${API_URL}/users/${userId}/`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    });
}

export const updateUserPassword = (userId: string, payload: UpdateUserPasswordProps): Promise<any> => {
  return axios
    .patch(`${API_URL}/users/${userId}/password`, payload, {
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` },
    });
}
import axios from 'axios';
import { GetMerchantApiResponse } from '@/pages/api/ikas/get-merchant';
import { ApiResponseType } from '../globals/types';
import { CheckForReauthorizeApiResponse } from '../pages/api/oauth/check-for-reauthorize';

export async function makePostRequest<T>({ url, data, token }: { url: string; data?: any; token?: string }) {
  return axios.post<ApiResponseType<T>>(url, data, {
    headers: token
      ? {
          Authorization: `JWT ${token}`,
        }
      : undefined,
  });
}

export async function makeGetRequest<T>({ url, data, token }: { url: string; data?: any; token?: string }) {
  return axios.get<ApiResponseType<T>>(url, {
    params: data,
    headers: token
      ? {
          Authorization: `JWT ${token}`,
        }
      : undefined,
  });
}

// API requests object - frontend-backend bridge
export const ApiRequests = {
  oauth: {
    checkForReauthorize: (token: string) => 
        makeGetRequest<CheckForReauthorizeApiResponse>({ url: '/api/oauth/check-for-reauthorize', token }),
  },
  ikas: {
    getMerchant: (token: string) =>
      makeGetRequest<{ data: GetMerchantApiResponse }>({
        url: '/api/ikas/get-merchant',
        token,
      }),
  },
};

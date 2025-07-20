import axios from 'axios';
import { ApiResponseType } from '../globals/constants';
import { CheckForReauthorizeApiResponse } from '../app/api/oauth/check-for-reauthorize/route';
import { GetTokenWithSignatureApiRequest, GetTokenWithSignatureApiResponse } from '../app/api/oauth/get-token-with-signature/route';
import { GetMerchantApiResponse } from '../app/api/ikas/get-merchant/route';

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
  ikas: {
    getMerchant: (token: string) => makeGetRequest<GetMerchantApiResponse>({ url: '/api/ikas/get-merchant', token }),
  },
  oauth: {
    checkForReauthorize: (token: string) => makeGetRequest<CheckForReauthorizeApiResponse>({ url: '/api/oauth/check-for-reauthorize', token }),
  },
  getTokenWithSignature: (data: GetTokenWithSignatureApiRequest) =>
    makePostRequest<GetTokenWithSignatureApiResponse>({ url: '/api/oauth/get-token-with-signature', data }),
};

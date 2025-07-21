import axios from 'axios';
import { ApiResponseType } from '../globals/constants';
import { CheckForReauthorizeApiResponse } from '../app/api/oauth/check-for-reauthorize/route';
import { GetTokenWithSignatureApiRequest, GetTokenWithSignatureApiResponse } from '../app/api/oauth/get-token-with-signature/route';
import { GetMerchantApiResponse } from '../app/api/ikas/get-merchant/route';
import { SaveWebhooksApiRequest } from '../app/api/ikas/save-webhook/route';
import { ListWebhookApiResponse } from '../app/api/ikas/list-webhook/route';

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
    saveWebhook: (data: SaveWebhooksApiRequest, token: string) => makePostRequest<any>({ url: '/api/ikas/save-webhook', data, token }),
    listWebhook: (token: string) => makeGetRequest<ListWebhookApiResponse>({ url: '/api/ikas/list-webhook', token }),
  },
  oauth: {
    checkForReauthorize: (token: string) => makeGetRequest<CheckForReauthorizeApiResponse>({ url: '/api/oauth/check-for-reauthorize', token }),
  },
  getTokenWithSignature: (data: GetTokenWithSignatureApiRequest) =>
    makePostRequest<GetTokenWithSignatureApiResponse>({ url: '/api/oauth/get-token-with-signature', data }),
};

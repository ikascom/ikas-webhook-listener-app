import axios from 'axios';
import { DeleteWebhookApiRequest } from '../app/api/ikas/delete-webhook/route';
import { GetMerchantApiResponse } from '../app/api/ikas/get-merchant/route';
import { ListSalesChannelApiResponse } from '../app/api/ikas/list-sales-channel/route';
import { ListWebhookApiResponse } from '../app/api/ikas/list-webhook/route';
import { SaveWebhooksApiRequest } from '../app/api/ikas/save-webhook/route';
import { ApiResponseType } from '../globals/constants';
import { ListProductApiResponse } from '@/app/api/ikas/list-product/route';

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
    deleteWebhook: (data: DeleteWebhookApiRequest, token: string) => makePostRequest<any>({ url: '/api/ikas/delete-webhook', data, token }),
    listSalesChannel: (token: string) => makeGetRequest<ListSalesChannelApiResponse>({ url: '/api/ikas/list-sales-channel', token }),
    listProduct: (token: string) => makeGetRequest<ListProductApiResponse>({ url: '/api/ikas/list-product', token }),
  },
};

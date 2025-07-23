import axios from 'axios';
import { CreateProductApiRequest } from '../app/api/ikas/create-product/route';
import { GetMerchantApiResponse } from '../app/api/ikas/get-merchant/route';
import { ListProductsApiResponse } from '../app/api/ikas/list-product/route';
import { UpdateProductApiRequest } from '../app/api/ikas/update-product/route';
import { CheckForReauthorizeApiResponse } from '../app/api/oauth/check-for-reauthorize/route';
import { GetTokenWithSignatureApiRequest, GetTokenWithSignatureApiResponse } from '../app/api/oauth/get-token-with-signature/route';
import { ApiResponseType } from '../globals/constants';

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
    createProduct: (data: CreateProductApiRequest, token: string) => makePostRequest<any>({ url: '/api/ikas/create-product', data, token }),
    updateProduct: (data: UpdateProductApiRequest, token: string) => makePostRequest<any>({ url: '/api/ikas/update-product', data, token }),
    listProduct: (token: string) => makeGetRequest<ListProductsApiResponse>({ url: '/api/ikas/list-product', token }),
  },
  oauth: {
    checkForReauthorize: (token: string) => makeGetRequest<CheckForReauthorizeApiResponse>({ url: '/api/oauth/check-for-reauthorize', token }),
  },
  getTokenWithSignature: (data: GetTokenWithSignatureApiRequest) =>
    makePostRequest<GetTokenWithSignatureApiResponse>({ url: '/api/oauth/get-token-with-signature', data }),
};

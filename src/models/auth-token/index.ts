import { BaseAuthToken } from '@/globals/types';

export interface AuthToken {
  _id: string;
  merchantId: string;
  authorizedAppId: string;
  salesChannelId?: string | null;
  accessToken: string;
  expireDate: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function getToken(token: AuthToken): BaseAuthToken {
  return {
    accessToken: token.accessToken,
    authorizedAppId: token.authorizedAppId,
    salesChannelId: token.salesChannelId || null,
    expireDate: token.expireDate,
    expiresIn: token.expiresIn,
    merchantId: token.merchantId,
    refreshToken: token.refreshToken,
    scope: token.scope,
    tokenType: token.tokenType,
    type: '',
    id: token._id,
    _id: token._id,
  };
} 
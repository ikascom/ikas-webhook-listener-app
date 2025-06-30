
export interface AuthToken {
  id: string;
  _id: string;
  merchantId: string;
  authorizedAppId?: string;
  salesChannelId: string | null;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;

  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expireDate: string;
  refreshToken: string;
  scope?: string;
}

export function getToken(token: AuthToken): AuthToken {
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
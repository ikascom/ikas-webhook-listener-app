export interface BaseAuthToken {
  id: string;
  _id: string;
  merchantId: string;
  authorizedAppId?: string;
  salesChannelId: string | null;
  type?: string;
  createdAt?: string;
  updatedAt?: string;

  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expireDate: string;
  refreshToken: string;
  scope?: string;
}

export interface WebhookPayload {
  id: string;
  type: string;
  data: any;
  createdAt: string;
  merchantId: string;
  authorizedAppId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 

export type ApiErrorData = {
  statusCode: number;
  message: string;
};
export type ApiErrorResponse = {
  statusCode: number;
  message: string;
};

export type ApiResponseType<T> = {
  data?: T;
  error?: ApiErrorResponse;
} | undefined;


export declare enum HttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  TOO_MANY_REQUEST = 429,
  SERVER_ERROR = 500
}
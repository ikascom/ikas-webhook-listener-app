export const TOKEN_COOKIE = '_session_data';
export const SESSION_USER = 'user';
export const DEFAULT_KEY = 'default';
export type ApiErrorData = {
  statusCode: number;
  message: string;
};
export type ApiErrorResponse = {
  statusCode: number;
  message: string;
};
export type ApiResponseType<T> =
  | {
      data?: T;
      error?: ApiErrorResponse;
    }
  | undefined;
export enum HttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  TOO_MANY_REQUEST = 429,
  SERVER_ERROR = 500,
}

export type CreateReturnType = {
  isOk: boolean;
  error?: string;
  data?: any;
};

export enum ApiErrorCode {
  TIMEOUT = "TIMEOUT",
  NOT_FOUND = "NOT_FOUND",
  BAD_REQUEST = "BAD_REQUEST",
  SERVER_ERROR = "SERVER_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  CONFLICT = "CONFLICT",
}

/**Types for API error handling, including error codes, success/failure responses, and a custom exception class for API errors. */
export interface ApiError {
  code: ApiErrorCode;
  message: string;
}

/**Types for API error handling, including error codes, success/failure responses, and a custom exception class for API errors. */
interface ApiSuccess<T> {
  success: true;
  error?: never;
  data: T;
}

/**Types for API error handling, including error codes, success/failure responses, and a custom exception class for API errors. */
export interface ApiFailure {
  success: false;
  error: ApiError;
  data?: never;
}

/**Types for API error handling, including error codes, success/failure responses, and a custom exception class for API errors. */
export class APIException extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
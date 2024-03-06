export type APIResponse<D = any, M = any> = {
  data: D;
  meta: M;
};

export type SuccessResponse<T = any> = {
  data: T;
  isSuccess: true;
  isError: false;
  errorMessage: null;
};

export type ErrorResponse = {
  data?: undefined;
  isSuccess: false;
  isError: true;
  errorMessage: string;
};

export type APIResponse<D = any, M = any> = {
  data: D;
  meta: M;
};

export type SuccessResponse<T> = {
  isSuccess: true;
  isError: false;
  error: null;
  data: T;
};

export type ErrorResponse = {
  isSuccess: false;
  isError: true;
  error: Error;
  data?: undefined;
};

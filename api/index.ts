import { ResponseStatus } from './constants';

import { getAsyncThunk } from './utils/get-async-thunk';
import type { ErrorPayload as AdapterErrorPayload } from './utils/default-error-adapter';
import {
  httpApiService,
  createHttpApiService,
  useHttpApiServiceContext,
  HttpApiServiceContext,
  isHttpApiServiceError,
  isCancelError,
} from './utils/create-http-api-service';
import type {
  ServiceError,
  ServiceInstance,
  ServiceResponse,
  ServiceConfig,
} from './utils/create-http-api-service';

import { getSomethingGood } from './services/good-service';

import useFetch from './useFetch';

// ---

// Если сервис используется через useFetch или getAsyncThunk,
// то он должен принимать первым параметром (config: ServiceConfig).
// Чтобы успешно отработать во время SSR.
export const API = {
  goodService: {
    getSomethingGood,
  },
};

// ---

export type ErrorPayload = AdapterErrorPayload;
export {
  ResponseStatus,
  useFetch,
  getAsyncThunk,

  ServiceError,
  ServiceInstance,
  ServiceResponse,
  ServiceConfig,
  httpApiService,
  createHttpApiService,
  isCancelError,
  isHttpApiServiceError,
  useHttpApiServiceContext,
  HttpApiServiceContext,
};

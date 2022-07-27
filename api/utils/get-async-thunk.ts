import { createAsyncThunk } from '@reduxjs/toolkit';

import { ResponseStatus } from '../constants';

import type { ServiceConfig, CreateHttpApiService } from './create-http-api-service';

import type { ResponseSuccessPayload } from './default-response-adapter';
import type { ErrorPayload } from './default-error-adapter';

// ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export type ThunkAPIConfig<Error> = {
  rejectValue: Error;
  extra: {
    createHttpApiService: CreateHttpApiService;
  };
};

export type CorrectValue = number | string | boolean | object | Any[];
type ServicePayload = CorrectValue | void;

export type Service<Response, Payload extends ServicePayload> = (
  config: ServiceConfig,
  payload: Payload,
) => Response;

export type SuccessServiceData<Response> = Extract<Awaited<Response>, { status: ResponseSuccessPayload<Any>['status'] }>;
export type ErrorServiceData<Response> = Extract<Awaited<Response>, { status: ErrorPayload['status'] }>;

export function getAsyncThunk<
  Response extends Promise<Any>,
  Payload extends ServicePayload
>(type: string, service: Service<Response, Payload>) {
  type Args = Parameters<typeof service>[1];

  return createAsyncThunk<
    SuccessServiceData<Response>,
    Args extends CorrectValue ? Args : void,
    ThunkAPIConfig<ErrorServiceData<Response>>
  >(type, async (data, thunkAPI) => {
    const { extra, rejectWithValue, signal } = thunkAPI;

    const instance = extra.createHttpApiService(signal);
    const payload = getThunkPayload(data);

    // eslint-disable-next-line
    // @ts-ignore
    const value = await service({ instance }, payload);

    if (value.status === ResponseStatus.SUCCESS) {
      return value;
    }

    return rejectWithValue(value);
  });
}

function getThunkPayload<T>(data: T | { payload: T }) {
  if (data instanceof Object && 'payload' in data) {
    return data.payload;
  }

  return data;
}

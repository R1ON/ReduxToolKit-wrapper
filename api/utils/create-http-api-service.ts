import { createContext, useContext } from 'react';
// eslint-disable-next-line no-restricted-imports
import axios, { AxiosInstance, AxiosResponse, AxiosError, Cancel } from 'axios';

// ---

export type ServiceError = AxiosError;
export type ServiceInstance = AxiosInstance;
export type ServiceResponse<T> = Promise<AxiosResponse<T>>;

export type ServiceConfig = {
  instance: ServiceInstance;
};

export type CreateHttpApiService = typeof createHttpApiService;

export const createHttpApiService = (signal?: AbortController['signal']): ServiceConfig['instance'] => {
  const instance = axios.create({ signal });

  // as example, you can add some interceptors
  // instance.interceptors.request.use(setLogRocketSessionId);

  return instance;
};

/*
* Используйте этот инстанс, если нужно просто сделать запрос на сервер.
* Если собираетесь обрабатывать отмену запроса (AbortController) или устанавливать какие-то заголовки
* То используйте функцию createHttpApiService.
* */
export const httpApiService = createHttpApiService();

// ---

export const HttpApiServiceContext = createContext<CreateHttpApiService | null>(null);

export const useHttpApiServiceContext = (): CreateHttpApiService => {
  const createInstance = useContext(HttpApiServiceContext);

  if (createInstance === null) {
    throw 'useHttpApiServiceContext must be used within a HttpApiServiceProvider.';
  }

  return createInstance;
};

// ---

export function isHttpApiServiceError(error: unknown): error is AxiosError {
  return error instanceof Object && 'isAxiosError' in error;
}

export function isCancelError(error: unknown): error is Cancel {
  return error instanceof axios.Cancel;
}

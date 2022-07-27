import { ResponseStatus } from '../constants';

export type ResponseSuccessPayload<T> = {
  status: ResponseStatus.SUCCESS;
  data: T;
};

export const defaultResponseAdapter = <T>(payload: T): ResponseSuccessPayload<T> => {
  return {
    status: ResponseStatus.SUCCESS,
    data: payload,
  };
};

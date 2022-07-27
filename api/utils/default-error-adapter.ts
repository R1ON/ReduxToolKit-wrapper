import { ResponseStatus } from '../constants';

import { isHttpApiServiceError, isCancelError, ServiceError } from './create-http-api-service';

// ---

export type ErrorPayload<D = void> = {
  data: D extends void ? unknown : D;
  message: string;
  status: Exclude<ResponseStatus, ResponseStatus.SUCCESS>;
};

export type ErrorHandler<D = null> = (error: ServiceError) => ErrorPayload<D>;

function createDefaultErrorAdapter<D, H extends ErrorHandler<D> | void = void>(
  errorHandler?: H,
): (error: unknown) => (H extends void ? ErrorPayload : ErrorPayload<D>);

function createDefaultErrorAdapter<D>(errorHandler?: ErrorHandler<D>) {
  return (
    (error: unknown) => {
      if (isCancelError(error)) {
        return createError(null, ResponseStatus.CANCEL_REQUEST);
      }

      if (!isHttpApiServiceError(error) || !error.response) {
        return createError(null);
      }

      if (errorHandler) {
        return errorHandler(error);
      }

      const { data, status, statusText } = error.response;

      return createError(data, status, statusText);
    }
  );
}

// ---

const DEFAULT_ERROR_STATUS = ResponseStatus.INTERNAL_SERVER;
export const DEFAULT_ERROR_MESSAGE = 'Что-то пошло не так.';

function createError<D = void>(
  data: D,
  status?: ErrorPayload['status'],
  message?: ErrorPayload['message'],
): ErrorPayload<D>;

function createError<D>(
  data: D,
  status: ErrorPayload['status'] = DEFAULT_ERROR_STATUS,
  message: ErrorPayload['message'] = DEFAULT_ERROR_MESSAGE,
) {
  return {
    data,
    status,
    message,
  };
}

export { createDefaultErrorAdapter, createError };

import type { DataFromBackend, TransformedData, TransformedError } from './types';
import { URL } from '../../constants';

import { ServiceConfig } from '../../utils/create-http-api-service';
import { defaultServiceAdapter } from '../../utils/default-service-adapter';
import { createError } from '../../utils/default-error-adapter';
import type { ServiceError } from '../../utils/create-http-api-service';

// ---

type Payload = {
    from: number;
    to: number;
};
  
export const getSomethingGood = (config: ServiceConfig, payload: Payload) => {
    return defaultServiceAdapter<DataFromBackend, TransformedData, TransformedError | null>(
        config.instance.post(URL.MY_API_URL, payload),
        {
            errorHandler: transformErrorHandler,
            responseHandler: transformData,
        },
    );
};

const transformData = (data: DataFromBackend): TransformedData => ({
  id: data.id,
  userName: data.name,
});

export const transformErrorHandler = (error: ServiceError) => {
  const response = error.response;
  const errors: TransformedError = {};

  if (!response) {
    return createError(null);
  }

  const { status, statusText, data } = response;
  if (!(data instanceof Object)) {
    return createError(null);
  }

  errors.something = 'something';

  return createError(errors, status, statusText);
};

  
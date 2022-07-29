import { ResponseStatus } from '../constants';

import { createDefaultErrorAdapter, ErrorPayload, ErrorHandler as DefaultErrorHandler } from './default-error-adapter';
import { defaultResponseAdapter, ResponseSuccessPayload } from './default-response-adapter';
import { ServiceResponse } from './create-http-api-service';

// ---

export type DefaultResponseHandler<Response, Transformed> = (response: Response) => Transformed;

export type Response<
  ResponseData,
  ErrorData = void
> = Promise<ResponseSuccessPayload<ResponseData> | ErrorPayload<ErrorData>>;

type ServiceOptions<ResponseData, TransformedData, ErrorData> = {
  errorHandler?: DefaultErrorHandler<ErrorData>;
  responseHandler?: DefaultResponseHandler<ResponseData, TransformedData>;
};

function defaultServiceAdapter<
  ResponseData,
  TransformedData = void,
  ErrorData = void,
  ErrorHandler extends DefaultErrorHandler<ErrorData> = DefaultErrorHandler<ErrorData>
>(
  request: ServiceResponse<ResponseData>,
  options?: ServiceOptions<ResponseData, TransformedData, ErrorData>,
): Response<
  TransformedData extends void ? ResponseData : TransformedData,
  ErrorHandler extends void ? void : ErrorData
>;

async function defaultServiceAdapter<ResponseData, TransformedData = null, ErrorData = null>(
  request: ServiceResponse<ResponseData>,
  options?: ServiceOptions<ResponseData, TransformedData, ErrorData>,
) {
  const response = await request.catch(createDefaultErrorAdapter(options?.errorHandler));

  if ('status' in response && response.status === ResponseStatus.SUCCESS) {
    return options?.responseHandler
      ? options.responseHandler(response.data)
      : defaultResponseAdapter<ResponseData>(response.data);
  }

  return response;
}

export { defaultServiceAdapter };

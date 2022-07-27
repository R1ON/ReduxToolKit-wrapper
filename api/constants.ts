export const enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  IS_REGISTERED = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  CANCEL_REQUEST = 499,
  INTERNAL_SERVER = 500,
  // clone and add more if you need ))
}

export const enum URL {
  MY_API_URL = '/api/get-good-request',
}

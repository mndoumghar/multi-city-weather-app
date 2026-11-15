

export const ERROR_CODES = Object.freeze({
  CITY_NOT_FOUND: "CITY_NOT_FOUND",
  NETWORK: "NETWORK_ERROR",
  RATE_LIMIT: "RATE_LIMIT",
  BAD_REQUEST: "BAD_REQUEST",
  API_ACCESS: "API_ACCESS_ERROR",
  SERVER: "SERVER_ERROR",
  HTTP: "HTTP_ERROR",
  INVALID_RESPONSE: "INVALID_RESPONSE",
  UNKNOWN: "UNKNOWN_ERROR",
})




const ERROR_MESSAGES = Object.freeze({
  [ERROR_CODES.CITY_NOT_FOUND]:
    "We couldn't find that city. Check the spelling and try again.",

  [ERROR_CODES.NETWORK]:
    "Unable to connect. Check your internet connection and try again.",

  [ERROR_CODES.RATE_LIMIT]:
    "Too many requests. Please wait a moment and try again.",

  [ERROR_CODES.BAD_REQUEST]:
    "The request was invalid. Please try again.",


  [ERROR_CODES.API_ACCESS]:
    "The weather service rejected the request. Please try again later.",

  [ERROR_CODES.SERVER]:
    "The weather service is temporarily unavailable. Please try again later.",

  [ERROR_CODES.HTTP]:
    "The weather service returned an unexpected response.",

  [ERROR_CODES.INVALID_RESPONSE]:
    "The weather service returned invalid data.",

  [ERROR_CODES.UNKNOWN]:
    "Something went wrong. Please try again.",
});



export class AppError extends Error {
  constructor(code, { status = null, cause } = {}) {
    const validCode = Object.hasOwn(ERROR_MESSAGES, code)
      ? code
      : ERROR_CODES.UNKNOWN;
    super(
      ERROR_MESSAGES[validCode],
      cause ? { cause } : undefined
    );
    this.name = "AppError";
    this.code = validCode;
    this.status = status;
  }
}


export function createHttpError(status) {
  let code = ERROR_CODES.HTTP;

  if (status === 400) {
    code = ERROR_CODES.BAD_REQUEST;
  } else if (status === 401 || status === 403) {
    code = ERROR_CODES.API_ACCESS;
  } else if (status === 429) {
    code = ERROR_CODES.RATE_LIMIT;
  } else if (status >= 500 && status <= 599) {
    code = ERROR_CODES.SERVER;
  }

  return new AppError(code, { status });
}




export function getErrorMessage(error) {
  if (error instanceof AppError) {
    return error.message;
  }

  return ERROR_MESSAGES[ERROR_CODES.UNKNOWN];
}




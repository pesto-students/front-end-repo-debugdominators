export const info = {
  CONTINUE: 100,
  SWITCH_PROTO: 101,
};

export const success = {
  OK: 200,
  CREATED: 201,
  NO_CONT: 204,
  PARTIAL_CONT: 206,
};

export const redirection = {
  MOVED_PERM: 301,
  MOVED_TEMP: 302,
  NOT_MOD: 304,
  TEMP_RED: 307,
  PERM_RED: 308,
};

export const client = {
  BAD_REQ: 400,
  UN_AUTH: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOW: 405,
  CONFLICT: 409,
  TOO_MANY_REQ: 429,
};

export const server = {
  INTERNAL_SERVER_ERR: 500,
  NOT_IMPLIMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVIL: 503,
  GATEWAY_TIME_OUT: 504,
};

export const headers = {
  JSON: {
    "Content-Type": "application/json",
  },
};

export const errorMessages = {
  SERVICE_UNAVIL: "Server is not ready to handle the request",
};

export const successMessages = {
  FETCHED_SUCCESS: "Data fetched successfully",
};

const statusCodes = {
  SUCCESS: 200, // OK
  CREATED: 201, // Resource successfully created
  BAD_REQUEST: 400, // Invalid request, malformed syntax
  UNAUTHORIZED: 401, // Unauthorized access, invalid credentials
  FORBIDDEN: 403, // Access denied, insufficient permissions
  NOT_FOUND: 404, // Resource not found
  METHOD_NOT_ALLOWED: 405, // HTTP method not allowed
  CONFLICT: 409, // Resource already exists (e.g., duplicate entry)
  GONE: 410, // Resource is no longer available and has been permanently removed
  UNPROCESSABLE_ENTITY: 422, // Validation errors, cannot process the entity
  INTERNAL_SERVER_ERROR: 500, // Generic server error
  NOT_IMPLEMENTED: 501, // Server does not support the functionality
  BAD_GATEWAY: 502, // Bad gateway, upstream server error
  SERVICE_UNAVAILABLE: 503, // Server is temporarily unavailable
  GATEWAY_TIMEOUT: 504, // Gateway timeout, server did not respond in time
  TOO_MANY_REQUESTS: 429, // Rate limit exceeded
};

export default statusCodes;

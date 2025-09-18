// custom error class for consistent API error handling across the app

export class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal Server Error",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;  
    this.errors = errors;          
    this.success = false;          
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

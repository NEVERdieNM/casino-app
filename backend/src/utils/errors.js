class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  exports.NotFoundError = class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
      super(message, 404);
    }
  };
  
  exports.UnauthorizedError = class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
      super(message, 401);
    }
  };
  
  exports.ForbiddenError = class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
      super(message, 403);
    }
  };
  
  exports.ValidationError = class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
      super(message, 400);
    }
  };
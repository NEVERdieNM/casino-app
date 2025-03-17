const logger = require('../utils/logger');

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

exports.errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(err.message, { stack: err.stack });

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Programming or unknown error: don't leak error details
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};
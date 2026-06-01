import ApiError from '../utils/ApiError.js';

const errorHandler = (error, req, res, next) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    details: error.details || undefined,
  });
};

export default errorHandler;

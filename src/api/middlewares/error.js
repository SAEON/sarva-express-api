const logger = require('../../config/logger');

exports.errorHandler = (err, req, res, _next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
  });
};

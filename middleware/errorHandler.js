const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  if (err.code === 'SQLITE_CONSTRAINT') {
    status = 400;

    if (err.message.includes('UNIQUE constraint failed')) {
      status = 409;
      message = 'Resource already exists.';
    } else if (err.message.includes('FOREIGN KEY constraint failed')) {
      message = 'Referenced resource does not exist.';
    }
  }

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

class NotFoundError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NotFoundError);
  }
}
/**
 * Class error for Unauthorized
 */
class UnauthorizedError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, UnauthorizedError);
  }
}
/**
 * Class error for Forbidden
 */
class ForbiddenError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ForbiddenError);
  }
}

const errorHandler = async (req, res, err) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof NotFoundError) {
    statusCode = 404;
    message = "Not found";
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    message = "Forbidden";
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    message = "Unauthorized";
  }

  res.status(statusCode);
  return res.json({ error: err.message || message });
};

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (err) {
    console.error(err.stack);
    return errorHandler(req, res, err);
  }
};

module.exports = {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  handleErrors
};

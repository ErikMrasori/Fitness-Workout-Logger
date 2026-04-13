const validateBody = (requiredFields) => (req, res, next) => {
  const missing = requiredFields.filter((field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === '');

  if (missing.length > 0) {
    return res.status(400).json({
      message: 'Validation failed.',
      missingFields: missing,
    });
  }

  return next();
};

module.exports = validateBody;

const { validationResult } = require('express-validator');

/**
 * Retrieves error messages from validation results on the request object.
 *
 * @param {Object} req - Express request object
 * @returns {string[]} - An array of error messages
 */
const getValidationErrors = (req) => {
  // Get validation results using Express-validator
  const errors = validationResult(req);

  // If there are errors, return them as an array
  if (!errors.isEmpty()) {
    return errors.array().map((error) => error.msg);
  }

  // If there are no errors, return an empty array
  return [];
};

module.exports = { getValidationErrors };

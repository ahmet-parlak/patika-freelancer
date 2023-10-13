const { body } = require('express-validator');

const username = body('username')
  .trim()
  .notEmpty()
  .withMessage('Please enter your username!');

const password = body('password')
  .trim()
  .notEmpty()
  .withMessage('Please enter your password!');

module.exports = { username, password };

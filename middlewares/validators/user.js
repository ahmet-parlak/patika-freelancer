const { body } = require('express-validator');

const username = body('username')
  .trim()
  .isLength({
    min: 3,
  })
  .withMessage('Please create a username of at least three characters!');

const password = body('password')
  .trim()
  .isLength({
    min: 3,
  })
  .withMessage('Please create a strong password of at least six characters!');

const passwordConfirm = body('password_confirm')
  .custom((value, { req }) => {
    return value === req.body.password;
  })
  .withMessage('Passwords do not match!');

module.exports = { username, password, passwordConfirm };

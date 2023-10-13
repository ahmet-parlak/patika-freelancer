const express = require('express');

const authController = require('../controllers/authController');
const userValidator = require('../middlewares/validators/user');
const loginValidator = require('../middlewares/validators/login');

const redirectMiddleware = require('../middlewares/redirectMiddleware');

const router = express.Router();

router.post(
  '/user',
  [
    userValidator.username,
    userValidator.password,
    userValidator.passwordConfirm,
  ],
  authController.register
);
router.post(
  '/login',
  redirectMiddleware,
  [(loginValidator.username, loginValidator.password)],
  authController.login
);
router.get('/logout', authController.logout);

module.exports = router;

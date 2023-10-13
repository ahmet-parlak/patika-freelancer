const express = require('express');

const pageController = require('../controllers/pageController');
const redirectMiddleware = require('../middlewares/redirectMiddleware');

const router = express.Router();

router.get('/', pageController.getIndexPage);
router.get('/login', redirectMiddleware, pageController.getLoginPage);

module.exports = router;

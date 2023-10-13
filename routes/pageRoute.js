const express = require('express');

const pageController = require('../controllers/pageController');

const router = express.Router();

router.get('/', pageController.getIndexPage);
router.get('/login', pageController.getLoginPage);

module.exports = router;

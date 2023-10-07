const express = require('express');

const pageController = require('../controller/pageController');

const router = express.Router();

router.get('/', pageController.getIndexPage);

module.exports = router;

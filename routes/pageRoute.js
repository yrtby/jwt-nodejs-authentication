const express = require('express');
const router = express.Router();

const pageController = require('../controllers/pageController');

// routes
router.route('/').get(pageController.index);

// export module
module.exports = router;
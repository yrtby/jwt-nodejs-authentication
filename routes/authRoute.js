const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Routes
router.route('/register').post(authController.create);
router.route('/activate').get(authController.activate);
router.route('/resend').post(authController.resendActivation);
router.route('/login').post(authController.login);

// export module
module.exports = router;
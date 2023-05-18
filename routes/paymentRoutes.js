const express = require('express');
const { processPayment, sendPayment } = require('../controllers/paymentController');
const router = express.Router();

const {authenticateUser} = require("../middleware/authenticate");

router.route('/payment/process').post(authenticateUser, processPayment);
router.route('/stripeApi').get(authenticateUser, sendPayment);

module.exports = router;

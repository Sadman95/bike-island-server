const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/payment.controller');

/**
 * ============
 * Order routes
 * ============
 */

//validateRequest(createOrderValidation)

router.post('/create-intent', createPaymentIntent);

module.exports = router;

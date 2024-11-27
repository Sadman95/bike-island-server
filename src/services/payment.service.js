const stripe = require('../config/stripe');
const { STACKHOLDER } = require('../enums');
const User = require('../models/user.model');

/**
 * PaymentService
 * @class
 */
class PaymentService {
  static createPaymentIntentService = async (payload) => {
    const { amount, currency } = payload;
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency,
      automatic_payment_methods: {
        enabled: true
      }
    });
    return paymentIntent;
  };
}

module.exports = PaymentService;

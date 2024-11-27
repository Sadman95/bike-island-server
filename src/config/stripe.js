// config/stripe.js
const Stripe = require('stripe');
const { stripeKeys } = require('./env');

const stripe = Stripe(stripeKeys.secret);

module.exports = stripe;

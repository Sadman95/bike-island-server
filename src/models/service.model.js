const mongoose = require('mongoose');


/**
 * Service schema definition for MongoDB using Mongoose.
 * @typedef {Object} Service
 * @property {string} serviceTitle - The title of the service
 * @property {string} serviceDesc - The description of the service
 * @property {number} servicePrice - The price of the servide
 * @property {string} serviceImg - The image of the servide
 */
const serviceSchema = new mongoose.Schema({
  serviceTitle: { type: String, required: true },
  serviceDesc: String,
  servicePrice: { type: Number, required: true },
  serviceImg: { type: String, required: true }
});

module.exports = mongoose.model('Service', serviceSchema);

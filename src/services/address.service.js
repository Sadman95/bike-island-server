const Address = require('../models/address.model');

/**
 * address service
 * @class
 */
class AddressService {
  /**
   * Create a new address.
   * @typedef {Object} Payload
   * @property {ObjectId} userId - The ID of the user to whom the address belongs.
   * @property {string} street - The street address.
   * @property {string} city - The city of the address.
   * @property {string} state - The state or region of the address.
   * @property {string} postalCode - The postal code of the address.
   * @property {string} country - The country of the address.
   *
   * @param {Payload} payload - The payload containing address details.
   * @returns {Promise<Document>} The created address document.
   */
  static createAddressService = async (payload) => {
    const address = new Address(payload);

    return await address.save();
  };
}

module.exports = AddressService;

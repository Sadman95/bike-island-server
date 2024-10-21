const Service = require('../models/service.model');

/**
 * others service
 * @class
 */
class OthersService {
  /**
   * returns all services
   * @returns Promise<Document[]>
   */
  static getServices = async () => {
    const services = await Service.find();
    return services;
  };

  /**
   * returns all services
   * @param {ObjectId} id - service id
   * @returns Promise<Document>
   */
  static getServiceByIdService = async (id) => {
    const service = await Service.findById(id);
    return service;
  };

  /**
   * @typedef {Object} Payload - create service payload
   * @property {string} title - service title
   * @property {string} description - service description
   * @property {number} price - service price
   * @property {string} image - service image
   *
   * @param {Payload} payload
   * @returns Promise<Document>
   */
  static createNewService = async (payload) => {
    const newService = new Service(payload);
    return await newService.save();
  };
}

module.exports = OthersService;

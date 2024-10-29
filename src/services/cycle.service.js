const CycleModel = require('../models/cycle.model');

/**
 * @class CycleService
 * @classdesc Handles business logic related to cycles
 */
class CycleService {
  /**
   * Retrieves all cycles from the database.
   * @returns {Promise<Array>} - Returns an array of cycle objects
   */
  static async findAllCycles(filter = {}, options = {}, sort = {}, limit = 0) {
    return await CycleModel.find(filter, options)
      .sort(sort)
      .limit(limit)
      .lean();
  }

  /**
   * Retrieves a cycle by ID from the database.
   * @param {string} id - The ID of the cycle
   * @returns {Promise<Object>} - Returns the cycle object
   */
  static async getCycleByIdService(id) {
    return await CycleModel.findById(id);
  }

  /**
   * @summary get cycles service
   * @typedef {Object} Options
   * @property {Record<string, any>} filterConditions
   * @property {Record<string, any>} sortConditions
   * @property {number} skip
   * @property {number} limit
   *
   * @param {Options} options
   * @returns {Promise<Document[]>}
   */
  static findAggregatedCycles = async (options) => {
    const { filterConditions, sortConditions, skip, limit } = options;

    const cycles = await CycleModel.aggregate([
      {
        $sort: sortConditions
      },
      {
        $skip: skip
      },
      {
        $limit: Number(limit)
      },
      {
        $match: filterConditions
      }
    ]);

    return cycles;
  };

  /**
   * @summary create cycle service
   * @typedef {Object} Payload
   * @property {string} productTitle
   * @property {string} productDesc
   * @property {string} productImg
   * @property {string} brand
   * @property {string} type
   * @property {number} productPrice
   *
   * @param {Payload} payload
   * @returns {Promise<Document>}
   */
  static createCycleService = async (payload) => {
    const cycle = new CycleModel(payload);
    const savedCycle = await cycle.save();
    return savedCycle;
  };

  /**
   * @summary update cycle service
   * @typedef {Object} Payload
   * @property {string} [productTitle = ""]
   * @property {string} [productDesc = ""]
   * @property {string} [productImg = ""]
   * @property {string} [brand = ""]
   * @property {string} [type= ""]
   * @property {number} [productPrice = 0]
   *
   * @param {string} id
   * @param {Payload} payload
   * @returns {Promise<Document>}
   */
  static updateCycleService = async (id, payload) => {
    const cycle = await CycleModel.findByIdAndUpdate({ _id: id }, payload, {
      new: true
    });
    return cycle;
  };

  /**
   * delete a cycle by ID from the database.
   * @param {string} id - The ID of the cycle
   */
  static async deleteCycleByIdService(id) {
    return await CycleModel.findByIdAndDelete({ _id: id });
  }

  /**
   * delete bulk cycles by ID from the database.
   * @param {string[]} ids - The IDs of the cycles
   */
  static async deleteBulkCyclesByIdService(ids) {
    return await CycleModel.deleteMany({ _id: { $in: ids } });
  }
}

module.exports = CycleService;

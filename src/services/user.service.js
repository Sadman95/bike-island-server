
const bcrypt = require('bcrypt')
const User = require('../models/user.model')

/**
 * @class
 */
class UserService {
  /**
   * @summary Find user by property
   * @param {Record<string, any>} filter
   * @returns {Promise<Document>}
   */
  static async findUser(filter) {
    return User.findOne(filter).lean();
  }

  /**
   * @summary Delete user by property
   * @param {Record<string, any>} filter
   * @returns {Promise<Document>}
   */
  static async deleteUserByProperty(filter) {
    return User.findOneAndDelete(filter).lean();
  }

  /**
   * @summary Find users
   * @param {Record<string, any>} [filter = {}]
   * @returns {Promise<Document>}
   */
  static async findUsers(filter = {}) {
    return User.find(filter).lean();
  }

  /**
   * @summary Find user by property
   * @param {string} password
   * @param {string} hash
   * @returns {boolean}
   */
  static async isMatchPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * @summary Update user profile
   *
   * @typedef {Object} Payload
   * @property {string} [firstName = ""]
   * @property {string} [lastName = ""]
   * @property {string} [constactNo = ""]
   * @property {USER_GENDER} [gender = ""]
   *
   * @param {import('mongoose').ObjectId} id
   * @param {Payload} payload
   * @returns {Promise<Document>}
   */
  static async userUpdateService(id, payload) {
    const result = await User.findByIdAndUpdate(
      {
        _id: id
      },
      payload,
      {
        new: true
      }
    );
    return result;
  }

  /**
   * @summary get users service
   * @typedef {Object} Options
   * @property {Record<string, any>} filterConditions
   * @property {Record<string, any>} sortConditions
   * @property {number} skip
   * @property {number} limit
   *
   * @param {Options} options
   * @returns {Promise<Document[]>}
   */
  static async getUsers(options) {
    const { filterConditions, sortConditions, skip, limit } = options;

    const users = await User.aggregate([
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
      },
      {
        $project: {
          password: 0,
          __v: 0
        }
      }
    ]);

    return users;
  }

  /**
   * delete a user by ID from the database.
   * @param {string} id - The ID of the user
   */
  static async deleteUserByIdService(id) {
    return await User.findByIdAndDelete({ _id: id });
  }

  /**
   * delete bulk users by ID from the database.
   * @param {string[]} ids - The IDs of the users
   */
  static async deleteBulkUsersByIdService(ids) {
    return await User.deleteMany({ _id: { $in: ids } });
  }
}



module.exports = UserService

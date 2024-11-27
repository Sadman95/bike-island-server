
const bcrypt = require('bcrypt')
const User = require('../models/user.model');
const { startSession } = require('mongoose');
const ApiError = require('../error/ApiError');
const httpStatus = require('http-status');
const { deleteBulkOrderService, findOrdersService } = require('./order.service');
const Order = require('../models/order.model');

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
   * @summary Find user by property and include total orders count
   * @param {Record<string, any>} filter
   * @returns {Promise<Record<string, any>>}
   */
  static async findCustomer(filter) {
    const user = await User.aggregate([
      {
        $match: filter
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },

      {
        $addFields: {
          totalOrders: { $size: '$orders' }
        }
      },

      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          isVerified: 1,
          contactNo: 1,
          avatar: 1,
          role: 1,
          createdAt: 1,
          totalOrders: 1
        }
      }
    ]);

    return user[0] || null;
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
        $match: filterConditions
      },
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
        $project: {
          password: 0,
          __v: 0
        }
      }
    ]);

    return users;
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
  static async getCustomers(options) {
    const { filterConditions, sortConditions, skip, limit } = options;

    const customers = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $match: {
          'orders.paymentId': { $exists: true, $ne: null },
          ...filterConditions
        }
      },
      {
        $addFields: {
          totalOrders: { $size: '$orders' }
        }
      },
      {
        $project: {
          password: 0,
          __v: 0,
          orders: 0
        }
      },
      {
        $sort: sortConditions
      },
      {
        $skip: skip
      },
      {
        $limit: Number(limit)
      }
    ]);

    return customers;
  }

  /**
   * delete a user by ID from the database.
   * @param {string} id - The ID of the user
   */
  static async deleteUserByIdService(id) {
    const session = await startSession();
    let deleted = false;
    try {
      session.startTransaction();

      const user = await User.findById(id).session(session);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      const orders = await Order.find({ user: user._id }).session(session);
      await Promise.all(
        orders.map(
          (order) => Order.findByIdAndDelete(order._id).session(session)
        )
      );

      await User.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
      await session.endSession();

      deleted = true;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    } finally {
      session.endSession();
    }
    return deleted;
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

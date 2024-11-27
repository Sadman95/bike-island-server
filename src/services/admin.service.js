const { db } = require('../config/env');
const connection = require('../db/connection');
const { STACKHOLDER } = require('../enums');
const User = require('../models/user.model');
const { findAllCycles, findAggregatedCycles } = require('./cycle.service');
const { findOrdersService, getAllOrdersService } = require('./order.service');
const { findUsers, getUsers } = require('./user.service');

/**
 * Admin service
 * @class
 */
class AdminService {
  /**
   * make someone admin by another admin
   * @param {string} id
   * @param {STACKHOLDER} role
   * @returns Promise<Document>
   */
  static changeRoleService = async (id, role) => {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        role: role
      },
      {
        new: true
      }
    );

    return user;
  };

  /**
   * get stats
   */
  static getStatsService = async () => {
    let res = null;

    const totalUsers = await findUsers();

    const userOptions = {
      filterConditions: {},
      sortConditions: {
        createdAt: -1
      },
      skip: 0,
      limit: totalUsers.length
    };
    const users = await getUsers(userOptions);

    const orderOptions = {
      filterConditions: {},
      sortConditions: {
        createdAt: -1
      },
      skip: 0,
      limit: 6
    };
    const orders = await getAllOrdersService(orderOptions);

    const cycles = await findAggregatedCycles(orderOptions);

    res = {
      users: {
        data: users,
        total: users.length
      },
      orders: {
        data: orders,
        total: orders.length
      },
      cycles: {
        data: cycles,
        total: cycles.length
      }
    };

    return res;
  };

  /**
   * get team members
   */
  static getTeamMembersService = async () => {
    const teamMembers = await User.find({ isTeamMember: true });

    return teamMembers;
  };
}

module.exports = AdminService;

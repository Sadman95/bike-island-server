const httpStatus = require('http-status');
const {
  PAGINATION,
  USER_FILTERABLE_FILEDS,
  USER_SEARCHABLE_FIELDS
} = require('../constants');
const ApiError = require('../error/ApiError');
const { catchAsyncHandler, pick, queryHelper } = require('../helper');

const sendResponse = require('../utils/send-response');
const { ResponseStatus } = require('../enums');
const {
  findUsers,
  getUsers,
  findUser,
  deleteUserByIdService,
  deleteBulkUsersByIdService,
  userUpdateService,
  getCustomers,
  findCustomer
} = require('../services/user.service');

/**
 * @class UserController
 * @classdesc Controller to handle user-related API endpoints
 */
class UserController {
  /**
   * Fetches all users from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns a list of all users
   */
  static getAllUsers = catchAsyncHandler(async function (req, res) {
    const filterableOptions = pick(req.query, USER_FILTERABLE_FILEDS);
    const paginationOptions = pick(req.query, PAGINATION);
    const { url, query, path } = req;
    const totalUsers = await findUsers();
    const options = {
      filterableOptions,
      paginationOptions,
      searchableFields: USER_SEARCHABLE_FIELDS,
      url,
      query,
      path,
      total: totalUsers.length
    };
    const { pagination, links, ...restOptions } = queryHelper(options);

    /* GET ALL USERS SERVICE */
    // const users = await getUsers(restOptions);

    /* GET ALL CUSTOMERS SERVICE */
    const users = await getCustomers(restOptions);

    if (users.length === 0)
      throw new ApiError(httpStatus.NOT_FOUND, 'No users found');
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: users,
      meta: {
        pagination,
        total: totalUsers.length
      },
      links
    });
  });

  /**
   * Fetches a user by ID.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns the user details
   */
  static getUserById = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;

    /* 
    GET USER
    =========
     */
    const user = await findUser({ _id: id });

    /* 
    GET CUSTOEMR
    ============
     */
    // const user = await findCustomer({_id: id});

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: user
    });
  });

  /**
   * Delete a user by ID.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static deleteUserById = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await deleteUserByIdService(id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete!');
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'User deleted!'
    });
  });

  /**
   * Delete bulk users
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static deleteBulkUsersById = catchAsyncHandler(async (req, res) => {
    const { ids } = req.body;
    await deleteBulkUsersByIdService(ids);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'Users deleted!'
    });
  });

  /**
   * update a user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns the updated user
   */
  static updateteUser = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.file) {
      // req.body.productImg = fileToUrl(req);
      req.body.avatar = req.file.fieldname + '/' + req.file.filename;
    }

    if (id !== req.user.id)
      throw new ApiError(httpStatus.CONFLICT, 'User id not matched!');

    const user = await userUpdateService(id, req.body);

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found!');

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      status: ResponseStatus.SUCCESS,
      data: user,
      message: 'User updated!'
    });
  });
}

module.exports = UserController;

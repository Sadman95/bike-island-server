const httpStatus = require('http-status');
const ApiError = require('../error/ApiError');
const { catchAsyncHandler } = require('../helper');
const RoleService = require('../services/role-permission.service');
const sendResponse = require('../utils/send-response');
const { ResponseStatus } = require('../enums');

/**
 * Role controller
 * @class
 */
class RoleController {
  /**
   * Create a new role.
   */
  static createRole = catchAsyncHandler(async (req, res) => {
    const { name, permissions } = req.body;

    const newRole = await RoleService.createRoleService({ name, permissions });

    if (!newRole)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create role!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.CREATED,
      success: true,
      data: newRole,
      message: `${newRole.name} is added to roles`
    });
  });

  /**
   * Get all roles.
   */
  static getAllRoles = catchAsyncHandler(async (req, res) => {
      const roles = await RoleService.getAllRolesService();
      
      if(roles.length == 0) throw new ApiError(httpStatus.NOT_FOUND, 'No role found!')

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      data: roles
    });
  });

  /**
   * Get a role by ID.
   */
  static getRoleById = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const role = await RoleService.getRoleByIdService(id);

    if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      data: role
    });
  });

  /**
   * Update a role by ID.
   */
  static updateRole = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedRole = await RoleService.updateRoleService(id, updates);

    if (!updatedRole)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update role!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      data: updatedRole,
      message: `${updatedRole.name} is updated`
    });
  });

  /**
   * Delete a role by ID.
   */
  static deleteRoleById = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedRole = await RoleService.deleteRoleByIdService(id);

    if (!deletedRole)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete role!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      data: deletedRole,
      message: `${deletedRole.name} is deleted`
    });
  });
}

module.exports = RoleController;

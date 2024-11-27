const Role = require('../models/role-permission.model');

/**
 * Role service
 * @class
 */
class RoleService {
  /**
   * Create a new role.
   * @typedef {Object} RolePayload
   * @property {string} name - The name of the role.
   * @property {Object} permissions - The permissions object containing modules and their actions.
   *
   * @param {RolePayload} payload - The payload containing role details.
   * @returns {Promise<Document>} The created role document.
   */
  static createRoleService = async (payload) => {
    const role = new Role(payload);
    return await role.save();
  };

  /**
   * Get all roles.
   * @returns {Promise<Document[]>} A list of all roles.
   */
  static getAllRolesService = async () => {
    return await Role.find({});
  };

  /**
   * Get a role by ID.
   * @param {string} id - The ID of the role to retrieve.
   * @returns {Promise<Document>} The role document, if found.
   * @throws Will throw an error if the role is not found.
   */
  static getRoleByIdService = async (id) => {
    const role = await Role.findById(id);
    return role;
  };

  /**
   * Update a role by ID.
   * @param {string} id - The ID of the role to update.
   * @param {Object} updates - The fields to update in the role.
   * @returns {Promise<Document>} The updated role document.
   * @throws Will throw an error if the role is not found.
   */
  static updateRoleService = async (id, updates) => {
    // Retrieve the current role
    const existingRole = await Role.findById(id);

    if (!existingRole) {
      throw new Error('Role not found');
    }

    // Merge the permissions (if provided)
    if (updates.permissions) {
      updates.permissions = {
        ...existingRole.permissions.toObject(),
        ...updates.permissions
      };
    }

    // Update the role
    const updatedRole = await Role.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    return updatedRole;
  };

  /**
   * Delete a role by ID.
   * @param {string} id - The ID of the role to delete.
   * @returns {Promise<Document>} The deleted role document.
   * @throws Will throw an error if the role is not found.
   */
  static deleteRoleByIdService = async (id) => {
    const role = await Role.findByIdAndDelete(id);
    return role;
  };
}

module.exports = RoleService;

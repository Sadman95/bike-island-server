const { check, param } = require('express-validator');

/**
 * Validation middleware for creating a role.
 */
const validateCreateRole = [
  check('name')
    .notEmpty()
    .withMessage('Role name is required.')
    .isString()
    .withMessage('Role name must be a string.')
    .isLength({ min: 3, max: 50 })
    .withMessage('Role name must be between 3 and 50 characters.'),
  check('permissions')
    .isObject()
    .withMessage('Permissions must be an object.')
    .custom((permissions) => {
      if (!Object.keys(permissions).length) {
        throw new Error('Permissions object cannot be empty.');
      }

      const validActions = ['view', 'edit', 'delete', 'add'];
      for (const [module, actions] of Object.entries(permissions)) {
        if (typeof actions !== 'object') {
          throw new Error(
            `Permissions for module "${module}" must be an object.`
          );
        }

        for (const [action, value] of Object.entries(actions)) {
          if (!validActions.includes(action)) {
            throw new Error(
              `Invalid action "${action}" in permissions for module "${module}".`
            );
          }

          if (typeof value !== 'boolean') {
            throw new Error(
              `Value for action "${action}" in permissions for module "${module}" must be a boolean.`
            );
          }
        }
      }

      return true;
    }),
  
];

/**
 * Validation middleware for updating a role.
 */
const validateUpdateRole = [
  param('id')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Id must be string')
    .isMongoId()
    .withMessage('Id must be mongo db id'),
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Role name is required.')
    .isString()
    .withMessage('Role name must be a string.')
    .isLength({ min: 3, max: 50 })
    .withMessage('Role name must be between 3 and 50 characters.'),
  check('permissions')
    .optional()
    .isObject()
    .withMessage('Permissions must be an object.')
    .custom((permissions) => {
      if (!Object.keys(permissions).length) {
        throw new Error('Permissions object cannot be empty.');
      }

      const validActions = ['view', 'edit', 'delete', 'add'];
      for (const [module, actions] of Object.entries(permissions)) {
        if (typeof actions !== 'object') {
          throw new Error(
            `Permissions for module "${module}" must be an object.`
          );
        }

        for (const [action, value] of Object.entries(actions)) {
          if (!validActions.includes(action)) {
            throw new Error(
              `Invalid action "${action}" in permissions for module "${module}".`
            );
          }

          if (typeof value !== 'boolean') {
            throw new Error(
              `Value for action "${action}" in permissions for module "${module}" must be a boolean.`
            );
          }
        }
      }

      return true;
    }),
  
];

module.exports = {
  validateCreateRole,
  validateUpdateRole
};

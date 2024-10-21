const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  deleteBulkUsersById,
  updateteUser
} = require('../controllers/user.controller');
const validateRequest = require('../middlewares/validate-request');
const {
  idParamValidation,
  bulkItemsIdValidation
} = require('../validations/common.validation');
const { STACKHOLDER } = require('../enums');
const { authenticate_roles } = require('../middlewares/validate-user');
const { updateUserValidation } = require('../validations/user.validation');

/**
 * ===========
 * User routes
 * ===========
 */

router
  .get('/', authenticate_roles(STACKHOLDER.ADMIN), getAllUsers)
  // .put('/', UsersController.makeAdmin)
  .get('/:id', validateRequest(idParamValidation), getUserById)
  .delete('/:id', validateRequest(idParamValidation), deleteUserById)
  .post(
    '/bulk-delete',
    authenticate_roles(STACKHOLDER.ADMIN),
    validateRequest(bulkItemsIdValidation),
    deleteBulkUsersById
  )
  .put('/:id', validateRequest(updateUserValidation), updateteUser);

module.exports = router;

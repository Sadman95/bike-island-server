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
const { authenticate_roles, authenticate } = require('../middlewares/validate-user');
const { updateUserValidation } = require('../validations/user.validation');
const upload = require('../middlewares/upload');

/**
 * ===========
 * User routes
 * ===========
 */

router
  .get('/', authenticate_roles(STACKHOLDER.ADMIN), getAllUsers)
  .get('/:id', validateRequest(idParamValidation), getUserById)
  .delete('/:id', validateRequest(idParamValidation), deleteUserById)
  .post(
    '/bulk-delete',
    authenticate_roles(STACKHOLDER.ADMIN),
    validateRequest(bulkItemsIdValidation),
    deleteBulkUsersById
  )
  .patch('/:id', authenticate, validateRequest(updateUserValidation), upload.single('avatar') , updateteUser);

module.exports = router;

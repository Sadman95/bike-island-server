const express = require('express');
const router = express.Router();
const {
  isVerified,
  authenticate_roles,
  authenticate,
} = require('../middlewares/validate-user');
const { STACKHOLDER } = require('../enums');
const { createOrder, getOrders, cancelOrder, deleteBulkOrders, deleteOrder, getUserOrders, getOrder, updateOrder } = require('../controllers/order.controller');
const validateRequest = require('../middlewares/validate-request');
const { createOrderValidation } = require('../validations/order.validation');
const { idParamValidation, bulkItemsIdValidation, ownIdParamValidation } = require('../validations/common.validation');


/**
 * ============
 * Order routes
 * ============
 */

//validateRequest(createOrderValidation)

router
  .get(
    '/self',
    authenticate,
    authenticate_roles(STACKHOLDER.USER),
    getUserOrders
  )
  .post(
    '/',
    authenticate,
    authenticate_roles(STACKHOLDER.USER),
    isVerified,
    createOrder
  )
  .get(
    '/',
    authenticate,
    authenticate_roles(STACKHOLDER.ADMIN, STACKHOLDER.MANAGER),
    getOrders
  )
  .get(
    '/:id',
    authenticate,
    authenticate_roles(
      STACKHOLDER.USER,
      STACKHOLDER.ADMIN,
      STACKHOLDER.MANAGER
    ),
    getOrder
  )
  .post(
    '/bulk-delete',
    authenticate,
    authenticate_roles(STACKHOLDER.ADMIN),
    validateRequest(bulkItemsIdValidation),
    deleteBulkOrders
  )
  .put(
    '/:id',
    authenticate,
    authenticate_roles(STACKHOLDER.USER, STACKHOLDER.ADMIN),
    validateRequest(idParamValidation),
    updateOrder
  )
  .delete(
    '/:id',
    authenticate,
    authenticate_roles(STACKHOLDER.ADMIN),
    validateRequest(idParamValidation),
    deleteOrder
  );

module.exports = router;

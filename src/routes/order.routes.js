const express = require('express');
const router = express.Router();
const {
  isVerified,
  authenticate_roles,
  authenticate,
} = require('../middlewares/validate-user');
const { STACKHOLDER } = require('../enums');
const { createOrder, getOrders, cancelOrder, deleteBulkOrders, deleteOrder, getUserOrders } = require('../controllers/order.controller');
const validateRequest = require('../middlewares/validate-request');
const { createOrderValidation } = require('../validations/order.validation');
const { idParamValidation, bulkItemsIdValidation } = require('../validations/common.validation');


/**
 * ============
 * Order routes
 * ============
 */

//validateRequest(createOrderValidation)

router
  .post('/', isVerified, createOrder)
  .get('/', authenticate, authenticate_roles(STACKHOLDER.ADMIN), getOrders)
  .get('/self',authenticate, authenticate_roles(STACKHOLDER.USER), getUserOrders)
  .post('/bulk-delete', authenticate, authenticate_roles(STACKHOLDER.ADMIN), validateRequest(bulkItemsIdValidation), deleteBulkOrders)
  .put('/:id', authenticate, validateRequest(idParamValidation), cancelOrder)
  .delete('/:id', authenticate, validateRequest(idParamValidation), deleteOrder);

module.exports = router;

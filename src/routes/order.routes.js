const express = require('express');
const router = express.Router();
const {
  isVerified,
  authenticate_roles,
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


router
  .post('/', isVerified, validateRequest(createOrderValidation), createOrder)
  .get('/', authenticate_roles(STACKHOLDER.ADMIN), getOrders)
  .get('/self', authenticate_roles(STACKHOLDER.USER), getUserOrders)
  .post('/bulk-delete', authenticate_roles(STACKHOLDER.ADMIN), validateRequest(bulkItemsIdValidation), deleteBulkOrders)
  .put('/:id', validateRequest(idParamValidation), cancelOrder)
  .delete('/:id', validateRequest(idParamValidation), deleteOrder);

module.exports = router;

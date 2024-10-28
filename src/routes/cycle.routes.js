const {
  getAllCycles,
  getCycleById,
  createCycle,
  updateteCycle,
  deleteCycleById,
  deleteBulkCyclesById
} = require('../controllers/cycle.controller');
const { STACKHOLDER } = require('../enums');
const upload = require('../middlewares/upload');
const validateRequest = require('../middlewares/validate-request');
const {
  authenticate_roles,
  authenticate
} = require('../middlewares/validate-user');
const {
  idParamValidation,
  bulkItemsIdValidation
} = require('../validations/common.validation');
const router = require('express').Router();
const {
  createCycleValidation,
  updateCycleValidation,
  getCyclesValidation
} = require('../validations/cycle.validation');

/**
 * ============
 * Cycle routes
 * ============
 */

router
  .get('/', validateRequest(getCyclesValidation), getAllCycles)
  .get('/:id', validateRequest(idParamValidation), getCycleById)
  .delete(
    '/:id',
    authenticate,
    authenticate_roles(STACKHOLDER.ADMIN),
    validateRequest(idParamValidation),
    deleteCycleById
  )
  .post(
    '/',
    authenticate,
    authenticate_roles(STACKHOLDER.ADMIN),
    upload.single('productImg'),
    validateRequest(createCycleValidation),
    createCycle
  )
  .post(
    '/bulk-delete',
    authenticate,
    authenticate_roles(STACKHOLDER.ADMIN),
    validateRequest(bulkItemsIdValidation),
    deleteBulkCyclesById
  )
  .put(
    '/:id',
    authenticate,
    authenticate_roles(STACKHOLDER.ADMIN),
    validateRequest(updateCycleValidation),
    updateteCycle
  );

module.exports = router;

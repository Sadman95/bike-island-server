const express = require('express');
const { getUserAddress, deleteUserAddress } = require('../controllers/address.controller');
const validateRequest = require('../middlewares/validate-request');
const { idParamValidation } = require('../validations/common.validation');
const router = express.Router();

/**
 * ============
 * Address routes
 * ============
 */


router.get('/', getUserAddress);
router.delete('/:id', validateRequest(idParamValidation), deleteUserAddress);

module.exports = router;

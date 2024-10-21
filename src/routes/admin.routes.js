const express = require('express');
const router = express.Router();
const validateRequest = require('../middlewares/validate-request');
const { updateRoleValidation } = require('../validations/admin.validation');
const { changeRole } = require('../controllers/admin.controller');


/**
 * ============
 * Admin routes
 * ============
 */


router.put('/change-role/:id', validateRequest(updateRoleValidation), changeRole);

module.exports = router;

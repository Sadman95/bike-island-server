const express = require('express');
const router = express.Router();
const validateRequest = require('../middlewares/validate-request');
const { updateRoleValidation } = require('../validations/admin.validation');
const { changeRole, getStats, getTeamMembers } = require('../controllers/admin.controller');
const rolePermissionRouter = require('./role-permission.routes.js')


/**
 * ============
 * Admin routes
 * ============
 */


router.put('/change-role/:id', validateRequest(updateRoleValidation), changeRole);
router.get('/stats', getStats);
router.get('/teams', getTeamMembers);
router.use('/roles', rolePermissionRouter)

module.exports = router;

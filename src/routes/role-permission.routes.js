const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRoleById
} = require('../controllers/role-permission.controller');
const validateRequest = require('../middlewares/validate-request');
const { idParamValidation } = require('../validations/common.validation');
const { validateCreateRole } = require('../validations/role-permission.validation');

const router = require('express').Router();

router.post('/', validateRequest(validateCreateRole), createRole);
router.get('/', getAllRoles);
router.get('/:id', validateRequest(idParamValidation), getRoleById);
router.put('/:id', updateRole);
router.delete('/:id', validateRequest(idParamValidation), deleteRoleById);

module.exports = router;

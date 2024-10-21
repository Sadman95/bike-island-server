const express = require('express');
const router = express.Router();
const { getAllServices, createService, getServiceById } = require('../controllers/others.controller');
const { authenticate, authenticate_roles } = require('../middlewares/validate-user');
const { STACKHOLDER } = require('../enums');
const upload = require('../middlewares/upload');

/**
 * ============
 * Service routes
 * ============
 */

router
    .get('/', getAllServices)
    .post('/', authenticate, authenticate_roles(STACKHOLDER.ADMIN), upload.single("serviceImg"), createService)
    .get("/:id", authenticate, getServiceById);

module.exports = router;

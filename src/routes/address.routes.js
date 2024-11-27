const express = require('express');
const { getUserAddress } = require('../controllers/address.controller');
const router = express.Router();

/**
 * ============
 * Address routes
 * ============
 */


router.get('/', getUserAddress);

module.exports = router;

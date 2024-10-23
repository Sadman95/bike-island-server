const express = require('express');
const router = express.Router();
const userRouter = require("./user.routes")
const cycleRouter = require("./cycle.routes")
const orderRouter = require("./order.routes")
const reviewRouter = require("./review.routes")
const authRouter = require("./auth.routes");
const adminRouter = require("./admin.routes")
const serviceRouter = require('./service.routes');
const { authenticate_roles, authenticate } = require('../middlewares/validate-user');
const { STACKHOLDER } = require('../enums');


/**
 * ===========
 * Root routes
 * ===========
 */

router.use("/auth", authRouter)
router.use(
  '/users',
  authenticate,
  userRouter
);
router.use("/cycles", cycleRouter)
router.use("/orders", orderRouter)
router.use("/reviews", reviewRouter)
router.use("/admin", authenticate, authenticate_roles(STACKHOLDER.ADMIN), adminRouter)
router.use("/services", serviceRouter)

module.exports = router;

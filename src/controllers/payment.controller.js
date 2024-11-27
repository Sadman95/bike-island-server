const httpStatus = require('http-status');
const ApiError = require('../error/ApiError');
const { catchAsyncHandler } = require('../helper');
const { changeRoleService } = require('../services/admin.service');
const sendResponse = require('../utils/send-response');
const { ResponseStatus } = require('../enums');
const { createPaymentIntentService } = require('../services/payment.service');

/**
 * payment controller
 * @class
 */
class PaymentController {
  static createPaymentIntent = catchAsyncHandler(async (req, res) => {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await createPaymentIntentService({ amount, currency });

    if (!paymentIntent)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Payment unsuccesful!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      success: true,
      data: paymentIntent.client_secret
    });
  });
}

module.exports = PaymentController;

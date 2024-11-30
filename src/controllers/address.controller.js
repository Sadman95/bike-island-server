const httpStatus = require('http-status');
const { catchAsyncHandler } = require('../helper');
const sendResponse = require('../utils/send-response');
const { ResponseStatus } = require('../enums');
const { getAddressService, deleteAddressService } = require('../services/address.service');
const ApiError = require('../error/ApiError');

/**
 * @class AddressController
 * @classdesc Controller to handle address-related API endpoints
 */
class AddressController {
  /**
   * Fetches user addresses from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Document>} - Returns a list of all address
   */
  static getUserAddress = catchAsyncHandler(async (req, res) => {

    const address = await getAddressService(req.user.id);

    if(!address || address.length == 0) throw new ApiError(httpStatus.NOT_FOUND, 'Oops! No address found')

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      data: address
    });
  });


  /**
   * Delete user addresses from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static deleteUserAddress = catchAsyncHandler(async (req, res) => {

    const address = await deleteAddressService({user: req.user.id, _id: req.params.id});

    if(!address) throw new ApiError(httpStatus.NOT_FOUND, 'Oops! Failed to delete address')

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      data: address
    });
  });

 
}

module.exports = AddressController;

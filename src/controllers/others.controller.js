const httpStatus = require('http-status');
const { catchAsyncHandler } = require('../helper');
const {
  getServices,
  getServiceByIdService,
  createNewService
} = require('../services/others.service');
const sendResponse = require('../utils/send-response');
const { ResponseStatus } = require('../enums');
const fileToUrl = require('../utils/file-to-url');

/**
 * @class ServiceController
 * @classdesc Controller to handle service-related API endpoints
 */
class ServiceController {
  /**
   * Fetches all services from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Document>} - Returns a list of all services
   */
  static getAllServices = catchAsyncHandler(async (req, res) => {
    const services = await getServices();

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      data: services
    });
  });

  /**
   * Fetches a service by ID.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns the service details
   */
  static getServiceById = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await getServiceByIdService(id);

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      data: service
    });
  });

  /**
   * Create a service
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns the new service
   */
  static createService = catchAsyncHandler(async (req, res) => {
    if (req.file) {
      req.body.serviceImg = fileToUrl(req);
    }

    const service = await createNewService(req.body);

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.CREATED,
      data: service
    });
  });
}

module.exports = ServiceController;

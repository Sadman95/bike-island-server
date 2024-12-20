const httpStatus = require('http-status');
const {
  PAGINATION,
  CYCLE_FILTERABLE_FILEDS,
  CYCLE_SEARCHABLE_FIELDS,
} = require('../constants');
const ApiError = require('../error/ApiError');
const { catchAsyncHandler, pick, queryHelper } = require('../helper');
const {
  findAggregatedCycles,
  findAllCycles,
  getCycleByIdService,
  createCycleService,
  updateCycleService,
  deleteCycleByIdService,
  deleteBulkCyclesByIdService
} = require('../services/cycle.service');
const sendResponse = require('../utils/send-response');
const { ResponseStatus } = require('../enums');
const { default: mongoose } = require('mongoose');

/**
 * @class CycleController
 * @classdesc Controller to handle cycle-related API endpoints
 */
class CycleController {
  /**
   * Fetches all cycles from the database.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns a list of all cycles
   */
  static getAllCycles = catchAsyncHandler(async function (req, res) {
    const filterableOptions = pick(req.query, CYCLE_FILTERABLE_FILEDS);
    const paginationOptions = pick(req.query, PAGINATION);
    const { url, query, path } = req;

    let fixedFilters = {};
    if (query.productId && query.type) {
      fixedFilters._id = {
        $ne: new mongoose.Types.ObjectId(query.productId)
      };
      fixedFilters.type = query.type;
    };
    
    if (query.minPrice) fixedFilters.productPrice = { $gte: query.minPrice };
    if (query.maxPrice) fixedFilters.productPrice = { $lte: query.maxPrice };
    const totalCycles = await findAllCycles(fixedFilters);

    const minPricedItem = await findAllCycles(
      {},
      { productPrice: 1, _id: 0 },
      { productPrice: +1 },
      1
    );

    const maxPricedItem = await findAllCycles(
      {},
      { productPrice: 1, _id: 0 },
      { productPrice: -1 },
      1
    );

    const options = {
      filterableOptions,
      paginationOptions,
      searchableFields: CYCLE_SEARCHABLE_FIELDS,
      url,
      query,
      path,
      total: totalCycles.length
    };
    const { pagination, links, ...restOptions } = queryHelper(options);

    const filters = totalCycles.reduce((acc, curr) => {
      if (curr.type && !acc.includes(curr.type)) {
        acc.push(curr.type);
      }
      return acc;
    }, []);

    const cycles = await findAggregatedCycles(restOptions);

    if (cycles.length === 0)
      throw new ApiError(httpStatus.NOT_FOUND, 'No cycles found');
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: cycles,
      meta: {
        total: totalCycles.length,
        pagination,
        filters,
        minPrice: minPricedItem[0].productPrice,
        maxPrice: maxPricedItem[0].productPrice
      },
      links
    });
  });

  /**
   * Fetches a cycle by ID.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns the cycle details
   */
  static getCycleById = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const cycle = await getCycleByIdService(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: cycle
    });
  });

  /**
   * Delete a cycle by ID.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static deleteCycleById = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteCycleByIdService(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'Cycle deleted!'
    });
  });

  /**
   * Delete bulk cycles
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static deleteBulkCyclesById = catchAsyncHandler(async (req, res) => {
    const { ids } = req.body;
    await deleteBulkCyclesByIdService(ids);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      message: 'Cycles deleted!'
    });
  });

  /**
   * Add a new cycle
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns the new cycle
   */
  static createCycle = catchAsyncHandler(async (req, res) => {
    if (req.file) {
      // req.body.productImg = fileToUrl(req);
      req.body.productImg = req.file.fieldname + '/' + req.file.filename;
    }

    const cycle = await createCycleService(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      status: ResponseStatus.SUCCESS,
      data: cycle,
      message: 'New cycle added!'
    });
  });

  /**
   * update a cycle
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns the updated cycle
   */
  static updateteCycle = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.file) {
      // req.body.productImg = fileToUrl(req);
      req.body.productImg = req.file.fieldname + '/' + req.file.filename;
    }

    const cycle = await updateCycleService(id, req.body);

    if (!cycle) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found!');

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      status: ResponseStatus.SUCCESS,
      data: cycle,
      message: 'Cycle updated!'
    });
  });
}

module.exports = CycleController;

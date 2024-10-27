const httpStatus = require('http-status');
const ApiError = require('../error/ApiError');
const { catchAsyncHandler, queryHelper, pick } = require('../helper');
const { createOrderService, findOrdersService, cancelOrderService, deleteOrderService, deleteBulkOrderService, getAllOrdersService } = require('../services/order.service');
const sendResponse = require('../utils/send-response');
const { ResponseStatus, STACKHOLDER } = require('../enums');
const { PAGINATION, ORDER_FILTERABLE_FILEDS, ORDER_SEARCHABLE_FIELDS } = require('../constants');

/**
 * order controller
 * @class
 */
class OrdersController {
  /**
   * CREATE a new order
   */
  static createOrder = catchAsyncHandler(async (req, res) => {

    
    let { address, ...others } = req.body

    
    address = {
      ...address,
      user: req.user.id
    }
    others = {
      ...others,
      user: req.user.id
    }
    const order = await createOrderService({ address, ...others })
    

    if (!order) throw new ApiError(httpStatus.BAD_REQUEST, "Order creation failed!")
    
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Order created successfully!",
      data: order,
    })

  })


  /**
   * GET orders by admin
   */
  static getOrders = catchAsyncHandler(async (req, res) => {
    
    const filterableOptions = pick(req.query, ORDER_FILTERABLE_FILEDS);
    const paginationOptions = pick(req.query, PAGINATION);
    const { url, query, path } = req;
    const totalOrders = await findOrdersService();
    const options = {
      filterableOptions,
      paginationOptions,
      searchableFields: ORDER_SEARCHABLE_FIELDS,
      url,
      query,
      path,
      total: totalOrders.length
    };
    const { pagination, links, ...restOptions } = queryHelper(options);

    const orders = await getAllOrdersService(restOptions);

    if (orders.length === 0)
      throw new ApiError(httpStatus.NOT_FOUND, 'No orders found');
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: orders,
      meta: {
        pagination
      },
      links
    });

  })

  /**
   * GET user orders
   */
  static getUserOrders = catchAsyncHandler(async (req, res) => {
    
    let filterableOptions = pick(req.query, ORDER_FILTERABLE_FILEDS);
    const paginationOptions = pick(req.query, PAGINATION);
    const { url, query, path } = req;
    const totalOrders = await findOrdersService({user: req.user.id});
    const options = {
      filterableOptions: { user: req.user.id, ...filterableOptions },
      paginationOptions,
      ORDER_SEARCHABLE_FIELDS,
      url,
      query,
      path,
      total: totalOrders.length
    };
    const { pagination, links, ...restOptions } = queryHelper(options);

    const orders = await getAllOrdersServicce(restOptions);

    if (orders.length === 0)
      throw new ApiError(httpStatus.NOT_FOUND, 'No orders found');
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: orders,
      meta: {
        pagination
      },
      links
    });
  })

  /**
   * Cancel order by user
   */
  static cancelOrder = catchAsyncHandler(async (req, res) => {

    const { id } = req.params
    
    const order = await cancelOrderService(id, req.user.id)

    if(!order) throw new ApiError(httpStatus.BAD_REQUEST, "Order update failed!")

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      message: "Order canceled!",
      data: order,
    })

  })


  
  /**
   * Delete an order
   */
  static deleteOrder = catchAsyncHandler(async (req, res) => {
    
    const { id } = req.params

    const isAdmin =
      req.user.role.toLowerCase() === STACKHOLDER.ADMIN.toLowerCase();
    
    const order = isAdmin
      ? await deleteOrderService({_id: id})
      : await deleteOrderService({_id: id, user: req.user.id});

    if (!order) throw new ApiError(httpStatus.BAD_REQUEST, "Order deletion failed!")
    
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      message: "Order deleted!",
      links: {
        orders: "/orders"
      }
    })

  })



  /**
   * Delete bulk orders
   */
  static deleteBulkOrders = catchAsyncHandler(async (req, res) => {
    
    const { ids } = req.body
    
    const orders = await deleteBulkOrderService(ids)

    if (!orders.deletedCount) throw new ApiError(httpStatus.BAD_REQUEST, "Order deletion failed!")
    
    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      message: "Order deleted!",
      links: {
        orders: "/orders"
      }
    })

  })
}

module.exports = OrdersController;

const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const ApiError = require('../error/ApiError');
const { catchAsyncHandler, queryHelper, pick } = require('../helper');
const {
  createOrderService,
  findOrdersService,
  deleteOrderService,
  deleteBulkOrderService,
  getAllOrdersService,
  findOrderService,
  updateOrderService
} = require('../services/order.service');
const sendResponse = require('../utils/send-response');
const { ResponseStatus, STACKHOLDER } = require('../enums');
const {
  PAGINATION,
  ORDER_FILTERABLE_FILEDS,
  ORDER_SEARCHABLE_FIELDS
} = require('../constants');

/**
 * order controller
 * @class
 */
class OrdersController {
  /**
   * CREATE a new order
   */
  static createOrder = catchAsyncHandler(async (req, res) => {
    let { address, ...others } = req.body;

    address = {
      ...address,
      user: req.user.id
    };
    others = {
      ...others,
      user: req.user.id
    };
    const paymentIntent = await createOrderService({ address, ...others });

    if (!paymentIntent)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Payment failed!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Order created successfully!',
      data: paymentIntent
    });
  });

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
        pagination,
        total: totalOrders.length
      },
      links
    });
  });

  /**
   * GET user orders
   */
  static getUserOrders = catchAsyncHandler(async (req, res) => {
    let filterableOptions = pick(req.query, [
      ...ORDER_FILTERABLE_FILEDS,
      'user'
    ]);
    const paginationOptions = pick(req.query, PAGINATION);
    const { url, query, path } = req;

    filterableOptions.user = req.user.id;

    const totalOrders = await findOrdersService(filterableOptions);

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

    // const orders = await getAllOrdersService(restOptions);

    if (totalOrders.length === 0)
      throw new ApiError(httpStatus.NOT_FOUND, 'No orders found');

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      status: ResponseStatus.SUCCESS,
      data: totalOrders,
      meta: { pagination },
      links
    });
  });

  /**
   * update order by user
   */
  static updateOrder = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const isAdmin =
      req.user.role.toLowerCase() === STACKHOLDER.ADMIN.toLowerCase();

    let order = null;

    order = isAdmin
      ? await updateOrderService({ _id: id }, payload)
      : await updateOrderService({ _id: id, user: req.user.id }, payload);

    if (!order)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order update failed!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      message: 'Order updated!',
      data: order
    });
  });

  /**
   * Delete an order
   */
  static deleteOrder = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const isAdmin =
      req.user.role.toLowerCase() === STACKHOLDER.ADMIN.toLowerCase();

    const order = isAdmin
      ? await deleteOrderService({ _id: id })
      : await deleteOrderService({ _id: id, user: req.user.id });

    if (!order)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order deletion failed!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      message: 'Order deleted!',
      links: {
        orders: '/dashboard/manage-orders'
      }
    });
  });

  /**
   * Get an order
   */
  static getOrder = catchAsyncHandler(async (req, res) => {
    const { id } = req.params;

    let userOrder = null;

    const isAdmin =
      req.user.role.toLowerCase() === STACKHOLDER.ADMIN.toLowerCase();

    if (isAdmin) {
      userOrder = await findOrderService({ _id: id });
    } else {
      userOrder = await findOrderService({ _id: id, user: req.user.id });
    }

    if (!userOrder)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      data: userOrder,
      links: {
        orders: `/dashboard/${isAdmin ? 'manage-orders' : 'orders'}`
      }
    });
  });

  /**
   * Delete bulk orders
   */
  static deleteBulkOrders = catchAsyncHandler(async (req, res) => {
    const { ids } = req.body;

    const orders = await deleteBulkOrderService(ids);

    if (!orders.deletedCount)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order deletion failed!');

    sendResponse(res, {
      status: ResponseStatus.SUCCESS,
      statusCode: httpStatus.OK,
      message: 'Order deleted!',
      links: {
        orders: '/dashboard/manage-orders'
      }
    });
  });
}

module.exports = OrdersController;

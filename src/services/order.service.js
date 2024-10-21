const { ORDER_STAT } = require('../enums');
const Order = require('../models/order.model');

/**
 * order service
 * @class
 */
class OrderService {
  /**
   * Retrieves all orders from the database.
   * @param {Object} [filter = {}] - additional filter
   * @returns {Promise<Array<Document>>} - Returns an array of order
   */
  static async findOrdersService(filter = {}) {
    return await Order.find(filter);
  }

  /**
   * Retrieve order by id
   * @param {ObjectId} [id = ""] - order id
   * @returns {Promise<Document>} - Returns an array of order
   */
  static async findOrderService(id) {
    return await Order.findOne({ _id: id }).populate({
      path: 'items.product',
      select: 'productTitle productImg productPrice'
    });
  }

  /**
   * delete order by id
   * @param {Record<string, unknown>} [filter = {}] - order filter
   * @returns {Promise<Document>} - Returns deleted order
   */
  static async deleteOrderService(filter) {
    return await Order.findByIdAndDelete(filter);
  }

  /**
   * delete orders
   * @param {Array<ObjectId>} [ids = []] - array of order ids
   */
  static async deleteBulkOrderService(ids) {
    return await Order.deleteMany({ _id: { $in: ids } });
  }

  /**
   * create order service
   * @typedef {Object} Item - item type definition
   * @property {ObjectId} product - product id
   * @property {Number} quantity - product quantity
   * @property {Number} price - product price
   *
   * @typedef {Object} Payload - payload type definition
   * @property {ObjectId} user - user id
   * @property {Array<Item>} [items = []] - order line items
   * @property {Number} [totalAmount = 0] - total order amount
   * @property {ORDER_STAT} [status = ORDER_STAT.PENDING] - order status
   * @param {Payload} payload - order payload
   * @returns
   */
  static createOrderService = async (payload) => {
    const newOrder = new Order(payload);

    return await newOrder.save();
  };

  /**
   * get all orders by admin
   * @typedef {Object} Options
   * @property {Record<string, any>} filterConditions
   * @property {Record<string, any>} sortConditions
   * @property {number} skip
   * @property {number} limit
   *
   * @param {Options} options
   * @returns {Promise<Document[]>}
   */
  static getAllOrdersService = async (options) => {
    const { filterConditions, sortConditions, skip, limit } = options;

    const orders = await Order.aggregate([
      {
        $match: filterConditions
      },
      {
        $lookup: {
          from: 'cycles',
          localField: 'items.product',
          foreignField: '_id',
          as: 'items.productDetails'
        }
      },
      {
        $unwind: '$items.productDetails'
      },
      {
        $project: {
          'items.productDetails.productTitle': 1,
          'items.productDetails.productImg': 1,
          'items.productDetails.productPrice': 1,
          user: 1,
          'items.quantity': 1,
          'items.price': 1,
          totalAmount: 1,
          status: 1,
          createdAt: 1
        }
      },
      {
        $sort: sortConditions
      },
      {
        $skip: skip
      },
      {
        $limit: Number(limit)
      }
    ]);

    return orders;
    };
    
   /**
    * cancel order before approved
    * @param {ObjectId} id - order id
    * @param {ObjectId} userId - user id
    */
    static cancelOrderService = async (id, userId) => {
        
        const order = await Order.findOneAndUpdate(
        
            { _id: id, user: userId, status: ORDER_STAT.PENDING },
          
            {
            status: ORDER_STAT.CANCELED
            },

            {
                new: true
            }
          
        );

        return order

    }
}

module.exports = OrderService;

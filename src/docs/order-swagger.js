/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /api/v2/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Order details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - totalAmount
 *             properties:
 *               items:
 *                 type: array
 *                 description: List of order items
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                     - price
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID of the product
 *                       example: "60b8d295f6e6f74f3c3d9b9d"
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product
 *                       example: 2
 *                     price:
 *                       type: number
 *                       description: Price of the product
 *                       example: 19.99
 *               totalAmount:
 *                 type: number
 *                 description: Total amount of the order
 *                 example: 39.98
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Order created successfully!"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

 /**
 * @swagger
 * /api/v2/orders:
 *   get:
 *     summary: Retrieve all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortByParam'
 *       - $ref: '#/components/parameters/sortOrderParam'
 *       - $ref: '#/components/parameters/searchParam'
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 meta:
 *                   $ref: '#/components/schemas/Pagination'
 *                 links:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin access required)
 *       404:
 *         description: No orders found
 */
 
 /**
 * @swagger
 * /api/v2/orders/self:
 *   get:
 *     summary: Retrieve your own orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortByParam'
 *       - $ref: '#/components/parameters/sortOrderParam'
 *       - $ref: '#/components/parameters/searchParam'
 *     responses:
 *       200:
 *         description: A list of your orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 meta:
 *                   $ref: '#/components/schemas/Pagination'
 *                 links:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No orders found
 */

 /**
 * @swagger
 * /api/v2/orders/{id}:
 *   put:
 *     summary: Cancel an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idPathParam'
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Order canceled!"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idPathParam'
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Order deleted!"
 *                 links:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: string
 *                       example: "/orders"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
 
 /**
 * @swagger
 * /api/v2/orders/bulk-delete:
 *   post:
 *     summary: Delete multiple orders by IDs (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Array of order IDs to delete
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "60b8d2e3f6e6f74f3c3d9b9e"
 *     responses:
 *       200:
 *         description: Orders deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Orders deleted!"
 *                 links:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: string
 *                       example: "/orders"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin access required)
 */

 /**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60b8d2e3f6e6f74f3c3d9b9e"
 *         user:
 *           type: string
 *           example: "60b8d295f6e6f74f3c3d9b9c"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 example: "60b8d295f6e6f74f3c3d9b9d"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: number
 *                 example: 19.99
 *         totalAmount:
 *           type: number
 *           example: 39.98
 *         status:
 *           type: string
 *           example: "PENDING"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2021-06-02T10:00:00.000Z"
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 100
 *         limit:
 *           type: integer
 *           example: 10
 *         page:
 *           type: integer
 *           example: 1
 *         pages:
 *           type: integer
 *           example: 10
 *
 *   parameters:
 *     pageParam:
 *       name: page
 *       in: query
 *       description: Page number for pagination
 *       schema:
 *         type: integer
 *         example: 1
 *     limitParam:
 *       name: limit
 *       in: query
 *       description: Number of items per page
 *       schema:
 *         type: integer
 *         example: 10
 *     sortByParam:
 *       name: sortBy
 *       in: query
 *       description: Field to sort by
 *       schema:
 *         type: string
 *         example: createdAt
 *     sortOrderParam:
 *       name: sortOrder
 *       in: query
 *       description: Sort order (asc or desc)
 *       schema:
 *         type: string
 *         enum: [asc, desc]
 *         example: desc
 *     searchParam:
 *       name: searchTerm
 *       in: query
 *       description: Search term to filter orders
 *       schema:
 *         type: string
 *         example: "pending"
 *     idPathParam:
 *       name: id
 *       in: path
 *       required: true
 *       description: ID of the order
 *       schema:
 *         type: string
 *         example: "60b8d2e3f6e6f74f3c3d9b9e"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * /api/v2/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 statusCode:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       product:
 *                         type: string
 *                       user:
 *                         type: string
 *                       rating:
 *                         type: integer
 *                       comment:
 *                         type: string
 *       404:
 *         description: Reviews not found
 */

/**
 * @swagger
 * /api/v2/reviews/{productId}:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a new review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 statusCode:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Failed to add review
 */

/**
 * @swagger
 * /api/v2/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete your own review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 statusCode:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Failed to delete review
 * 
 */


 /**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - product
 *         - user
 *         - rating
 *         - comment
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the review
 *         product:
 *           type: string
 *           description: The reference to the product (cycle) being reviewed
 *           example: 60d21b4667d0d8992e610c85
 *         user:
 *           type: string
 *           description: The reference to the user who made the review
 *           example: 60d21b4667d0d8992e610c84
 *         rating:
 *           type: number
 *           description: The rating given to the product (1 to 5)
 *           example: 4
 *         comment:
 *           type: string
 *           description: The comment provided in the review
 *           example: This cycle is amazing for mountain trails!
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the review was posted
 *       example:
 *         id: 60d21b4667d0d8992e610c87
 *         product: 60d21b4667d0d8992e610c85
 *         user: 60d21b4667d0d8992e610c84
 *         rating: 4
 *         comment: This cycle is amazing for mountain trails!
 *         createdAt: 2023-10-22T10:45:30.000Z
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

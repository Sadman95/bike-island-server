/**
 * @swagger
 * tags:
 *   name: Cycles
 *   description: API for managing cycles
 */

/**
 * @swagger
 * /api/v2/cycles:
 *   get:
 *     summary: Retrieve a list of cycles
 *     tags: [Cycles]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortByParam'
 *       - $ref: '#/components/parameters/sortOrderParam'
 *       - $ref: '#/components/parameters/searchParam'
 *     responses:
 *       200:
 *         description: A list of cycles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "12345"
 *                   name:
 *                     type: string
 *                     example: "Cycle A"
 *                   description:
 *                     type: string
 *                     example: "Mountain bike with advanced suspension"
 *                   price:
 *                     type: number
 *                     example: 499.99
 *       500:
 *         description: Server error
 * 
 */


 /**
 * @swagger
 * /api/v2/cycles/{id}:
 *   get:
 *     summary: Retrieve a cycle by ID
 *     tags: [Cycles]
 *     parameters:
 *       - $ref: '#/components/parameters/idPathParam'
 *     responses:
 *       200:
 *         description: A single cycle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "12345"
 *                 name:
 *                   type: string
 *                   example: "Cycle A"
 *                 description:
 *                   type: string
 *                   example: "Mountain bike with advanced suspension"
 *                 price:
 *                   type: number
 *                   example: 499.99
 *       404:
 *         description: Cycle not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a cycle by ID (Admin only)
 *     tags: [Cycles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idPathParam'
 *     responses:
 *       204:
 *         description: Cycle deleted successfully
 *       404:
 *         description: Cycle not found
 *       403:
 *         description: Forbidden (Only admin can delete)
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a cycle by ID (Admin only)
 *     tags: [Cycles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idPathParam'
 *     requestBody:
 *       description: Data for updating the cycle
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Cycle Name"
 *               description:
 *                 type: string
 *                 example: "Updated description for cycle"
 *               price:
 *                 type: number
 *                 example: 599.99
 *     responses:
 *       200:
 *         description: Cycle updated successfully
 *       404:
 *         description: Cycle not found
 *       403:
 *         description: Forbidden (Only admin can update)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v2/cycles:
 *   post:
 *     summary: Create a new cycle (Admin only)
 *     tags: [Cycles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data for creating a new cycle
 *       required: true
 *       content:
 *         multipart/form-data:    # Use multipart for file uploads
 *           schema:
 *             type: object
 *             properties:
 *               productTitle:
 *                 type: string
 *                 example: "New Cycle"
 *               productDesc:
 *                 type: string
 *                 example: "High performance road bike"
 *               brand:
 *                 type: string
 *                 example: "Hero"
 *               type:
 *                 type: string
 *                 example: "Mountain"
 *               productPrice:
 *                 type: number
 *                 example: 999.99
 *               productImg:        # File field for product image
 *                 type: string
 *                 format: binary    # Specify it as a binary file
 *     responses:
 *       201:
 *         description: Cycle created successfully
 *       403:
 *         description: Forbidden (Only admin can create)
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/v2/cycles/bulk-delete:
 *   post:
 *     summary: Delete multiple cycles by passing an array of IDs
 *     tags: [Cycles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
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
 *                   example: "61c6e0f2e5f3b2044c1a30a1"
 *                 description: Array of cycle IDs to be deleted
 *     responses:
 *       200:
 *         description: Cycles deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cycles deleted successfully"
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Some cycles not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cycle:
 *       type: object
 *       required:
 *         - productTitle
 *         - brand
 *         - type
 *         - productImg
 *         - productPrice
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the cycle
 *         productTitle:
 *           type: string
 *           description: The title of the product (cycle)
 *         productDesc:
 *           type: string
 *           description: A brief description of the cycle
 *         brand:
 *           type: string
 *           description: The brand of the cycle
 *           example: Trek
 *         type:
 *           type: string
 *           description: The type of cycle (e.g., mountain, hybrid)
 *           example: mountain
 *         productImg:
 *           type: string
 *           description: The URL of the product image
 *           example: https://example.com/cycle-image.jpg
 *         productPrice:
 *           type: number
 *           description: The price of the cycle
 *           example: 599.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the cycle was added
 *       example:
 *         id: 60d21b4667d0d8992e610c85
 *         productTitle: Trek Marlin 5
 *         productDesc: A mountain bike perfect for trail riding.
 *         brand: Trek
 *         type: mountain
 *         productImg: https://example.com/cycle-image.jpg
 *         productPrice: 599.99
 *         createdAt: 2023-10-22T10:45:30.000Z
 * 
 *   parameters:
 *     pageParam:
 *       name: page
 *       in: query
 *       description: Enter page number
 *       required: false
 *       schema:
 *         type: integer
 *         example: 1
 *     limitParam:
 *       name: limit
 *       in: query
 *       description: Enter limit
 *       required: false
 *       schema:
 *         type: integer
 *         example: 10
 *     sortByParam:
 *       name: sortBy
 *       in: query
 *       description: Sort results by a specific field
 *       required: false
 *       schema:
 *         type: string
 *         example: updatedAt
 *     sortOrderParam:
 *       name: sortOrder
 *       in: query
 *       description: Sort order (ascending or descending)
 *       required: false
 *       schema:
 *         type: string
 *         enum:
 *           - asc
 *           - desc
 *         example: desc
 *     searchParam:
 *       name: searchTerm
 *       in: query
 *       description: Search term to filter cycles
 *       required: false
 *       schema:
 *         type: string
 *         example: "mountain"
 *     idPathParam:
 *       name: id
 *       in: path
 *       description: The ID of the cycle
 *       required: true
 *       schema:
 *         type: string
 *         example: "12345"
 */

/**
 * @swagger
 * tags:
 *   name: Cycles
 *   description: API endpoints for managing cycle products
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
 *       - name: type
 *         in: query
 *         description: Filter cycles by type (e.g., mountain, hybrid)
 *         required: false
 *         schema:
 *           type: string
 *           example: "mountain"
 *       - name: minPrice
 *         in: query
 *         description: Minimum price
 *         required: false
 *         schema:
 *           type: string
 *           example: "100"
 *       - name: maxPrice
 *         in: query
 *         description: Max price
 *         required: false
 *         schema:
 *           type: string
 *           example: "500"
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
 *                   type:
 *                     type: string
 *                     example: "mountain"
 *                   price:
 *                     type: number
 *                     example: 499.99
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/v2/cycles/{id}:
 *   get:
 *     summary: Retrieve a specific cycle by its ID
 *     tags: [Cycles]
 *     parameters:
 *       - $ref: '#/components/parameters/idPathParam'
 *     responses:
 *       200:
 *         description: Detailed information of the specified cycle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cycle'
 *       404:
 *         description: Cycle not found
 *       500:
 *         description: Internal server error
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
 *       403:
 *         description: Forbidden (Only admin users can delete cycles)
 *       404:
 *         description: Cycle not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a cycle by ID (Admin only)
 *     tags: [Cycles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idPathParam'
 *     requestBody:
 *       description: JSON object containing data for updating the cycle
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cycle'
 *     responses:
 *       200:
 *         description: Cycle updated successfully
 *       403:
 *         description: Forbidden (Only admin users can update cycles)
 *       404:
 *         description: Cycle not found
 *       500:
 *         description: Internal server error
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
 *       description: Form data for creating a new cycle
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productTitle:
 *                 type: string
 *                 example: "New Cycle"
 *               productDesc:
 *                 type: string
 *                 example: "High-performance road bike"
 *               brand:
 *                 type: string
 *                 example: "Hero"
 *               type:
 *                 type: string
 *                 example: "Mountain"
 *               productPrice:
 *                 type: number
 *                 example: 999.99
 *               productImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cycle created successfully
 *       403:
 *         description: Forbidden (Only admin users can create cycles)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v2/cycles/bulk-delete:
 *   post:
 *     summary: Delete multiple cycles by passing an array of IDs (Admin only)
 *     tags: [Cycles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "61c6e0f2e5f3b2044c1a30a1"
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
 *         description: Invalid input (e.g., incorrect ID format)
 *       404:
 *         description: Some cycles not found
 *       403:
 *         description: Forbidden (Only admin users can perform bulk delete)
 *       500:
 *         description: Internal server error
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
 *           description: The unique identifier of the cycle
 *           example: "60d21b4667d0d8992e610c85"
 *         productTitle:
 *           type: string
 *           description: Title of the cycle product
 *           example: "Trek Marlin 5"
 *         productDesc:
 *           type: string
 *           description: A brief description of the cycle
 *           example: "A mountain bike perfect for trail riding."
 *         brand:
 *           type: string
 *           description: Brand of the cycle
 *           example: "Trek"
 *         type:
 *           type: string
 *           description: Type of cycle (e.g., mountain, hybrid)
 *           example: "mountain"
 *         productImg:
 *           type: string
 *           description: URL of the cycle's image
 *           example: "https://example.com/cycle-image.jpg"
 *         productPrice:
 *           type: number
 *           description: Price of the cycle in USD
 *           example: 599.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the cycle was created
 *           example: "2023-10-22T10:45:30.000Z"
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
 *       description: Field to sort by (e.g., createdAt)
 *       schema:
 *         type: string
 *         example: "createdAt"
 *     sortOrderParam:
 *       name: sortOrder
 *       in: query
 *       description: Order of sorting (ascending or descending)
 *       schema:
 *         type: string
 *         enum:
 *           - asc
 *           - desc
 *         example: "desc"
 *     searchParam:
 *       name: searchTerm
 *       in: query
 *       description: Search term to filter cycles by name or description
 *       schema:
 *         type: string
 *         example: "mountain"
 *     idPathParam:
 *       name: id
 *       in: path
 *       description: Unique identifier of the cycle
 *       required: true
 *       schema:
 *         type: string
 *         example: "60d21b4667d0d8992e610c85"
 */

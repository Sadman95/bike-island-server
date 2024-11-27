/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/v2/users:
 *   get:
 *     summary: Retrieve a paginated list of users with optional search, sorting, and filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of users to return per page
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           example: "John"
 *         description: Term to search users by name or email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: "name"
 *         description: The field to sort users by (e.g., name, email, createdAt)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: "asc"
 *         description: The order to sort the users, either ascending (asc) or descending (desc)
 *     responses:
 *       200:
 *         description: A paginated list of users with sorting
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "12345"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       role:
 *                         type: string
 *                         example: "user"
 *                 totalUsers:
 *                   type: integer
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/v2/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "12345"
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v2/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe Updated"
 *               email:
 *                 type: string
 *                 example: "john.updated@example.com"
 *               contactNo:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Doe Updated"
 *                 email:
 *                   type: string
 *                   example: "john.updated@example.com"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v2/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v2/users/bulk-delete:
 *   post:
 *     summary: Bulk delete users
 *     tags: [Users]
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
 *                 example: ["12345", "67890"]
 *     responses:
 *       204:
 *         description: Users deleted successfully
 *       400:
 *         description: Invalid IDs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         firstName:
 *           type: string
 *           description: The user's first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: The user's last name
 *           example: "Doe"
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *           example: "$2b$10$EIXo9u6MSv7S7t6H/lKfQO55ozC1BOM6fZGHk4W6Ohnw2k/mD6f4m"
 *         isVerified:
 *           type: boolean
 *           description: Indicates if the user's email is verified
 *           example: false
 *         contactNo:
 *           type: string
 *           description: The user's contact number
 *           example: "+1234567890"
 *         avatar:
 *           type: string
 *           description: The URL of the user's avatar
 *           example: "http://localhost:3000/images/avatar/demo-Male.png"
 *         role:
 *           type: string
 *           description: The user's role in the system
 *           enum:
 *             - USER
 *             - ADMIN
 *           example: "USER"
 *       example:
 *         id: 60d21b4667d0d8992e610c88
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         password: "$2b$10$EIXo9u6MSv7S7t6H/lKfQO55ozC1BOM6fZGHk4W6Ohnw2k/mD6f4m"
 *         isVerified: false
 *         contactNo: "+1234567890"
 *         avatar: "http://localhost:3000/images/avatar/demo-Male.png"
 *         role: "USER"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

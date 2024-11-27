/**
 * @swagger
 * components:
 *   schemas:
 *     OTP:
 *       type: object
 *       required:
 *         - otp
 *         - userId
 *         - createdAt
 *         - expiresAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the OTP record
 *         otp:
 *           type: string
 *           description: The One Time Password (OTP) value
 *           example: "123456"
 *         userId:
 *           type: string
 *           description: The reference to the user associated with the OTP
 *           example: 60d21b4667d0d8992e610c84
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the OTP was created
 *           example: 2023-10-22T10:45:30.000Z
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the OTP expires
 *           example: 2023-10-22T10:50:30.000Z
 *       example:
 *         id: 60d21b4667d0d8992e610c88
 *         otp: "123456"
 *         userId: 60d21b4667d0d8992e610c84
 *         createdAt: 2023-10-22T10:45:30.000Z
 *         expiresAt: 2023-10-22T10:50:30.000Z
 */

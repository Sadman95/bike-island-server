const httpStatus = require('http-status');
const { MongoMemoryServer } = require('mongodb-memory-server');
const connection = require('../src/db/connection');
const mongoose = require('mongoose');
const { decrypt } = require('../src/utils/encrypt-decrypt');
const { db } = require('../src/config/env');
const { jwtHelper } = require('../src/helper');
const { STACKHOLDER } = require('../src/enums');
const {
  findPasswordResetToken,
  deletePasswordResetToke
} = require('../src/services/password-reset.service');
const AuthService = require('../src/services/auth.service');
const { agent } = require('../src/lib/agent');
const { deleteUserByIdService, deleteUserByProperty } = require('../src/services/user.service');
const { deleteOtp } = require('../src/services/otp.service');
const { SIGNUP_PAYLOAD, SIGNIN_PAYLOAD } = require('../__mock__');

jest.setTimeout(10000);

describe('==== Authentication test ====', () => {
  // mock data
  
  let mongoServer;
  let uri;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    await connection(uri, db.name);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    jest.clearAllMocks();
  });
  // mock data

  /* Test: Sign UP */
  describe('==== Sign Up ====', () => {
    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByProperty({ email: SIGNUP_PAYLOAD.email });
    });
    it('should return user from db', async () => {
      const { statusCode, body } = await agent
        .post('/api/v2/auth/signup')
        .send(SIGNUP_PAYLOAD);

      expect(statusCode).toBe(httpStatus.CREATED);
    });
  });

  /* Test: Sign In */
  describe('==== Sign In ====', () => {
    let mockUser;
    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
    });

    it('should return token', async () => {
      const { statusCode, body } = await agent
        .post('/api/v2/auth/login')
        .send(SIGNIN_PAYLOAD);

      // Assert the status code is OK
      expect(statusCode).toBe(httpStatus.OK);

      // Assert the response contains a token
      expect(body.data).toEqual(
        expect.objectContaining({
          token: expect.any(String)
        })
      );
    });
  });

  /* Test: Refersh */
  describe('==== Refersh ====', () => {
    let mockUser;

    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
    });

    it('should return new access token', async () => {
      const refresh_token = jwtHelper.refresh_token({
        id: mockUser._id,
        email: SIGNIN_PAYLOAD.email,
        role: STACKHOLDER.USER
      });

      const {  body } = await agent
        .post('/api/v2/auth/refresh')
        .set('Cookie', [
          `refresh_token=${refresh_token}` // <-- No 'express:sess' (Cropped for demo)
        ]);

      expect(body.data).toEqual(
        expect.objectContaining({
          token: expect.any(String)
        })
      );
    });
  });

  /* Test: Get OTP */
  describe('==== Get otp ====', () => {
    let mockUser;

    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
    });

    it('should return otp', async () => {
      const token = jwtHelper.token({
        id: mockUser._id,
        email: SIGNIN_PAYLOAD.email,
        role: STACKHOLDER.USER
      });

      const { statusCode, body } = await agent
        .post('/api/v2/auth/get-otp')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: SIGNIN_PAYLOAD.email
        });

      expect(statusCode).toBe(httpStatus.OK);

      expect(body.data).toEqual(
        expect.objectContaining({
          otp: expect.any(String)
        })
      );
    }, 30000);
  });

  /* Test: Get own OTP */
  describe('==== Get own otp ====', () => {
    let mockUser;
    let mockOtp;

    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);
      mockOtp = await AuthService.getEmailOtpService(
        mockUser._id,
        mockUser.email
      );
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
      await deleteOtp({ _id: mockOtp._id });
    });
    it('should return own otp', async () => {
      const token = jwtHelper.token({
        id: mockUser._id,
        email: SIGNIN_PAYLOAD.email,
        role: STACKHOLDER.USER
      });

      const { statusCode, body } = await agent
        .get('/api/v2/auth/own-otp')
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(httpStatus.OK);

      expect(body.data).toEqual(
        expect.objectContaining({
          otp: expect.any(String)
        })
      );
    });
  });

  /* Test: OTP verification */
  describe('==== OTP verification ====', () => {
    let mockUser;
    let mockOtp;

    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService({
        ...SIGNUP_PAYLOAD,
        isVerified: false
      });
      mockOtp = await AuthService.getEmailOtpService(
        mockUser._id,
        mockUser.email
      );
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
      await deleteOtp({ _id: mockOtp._id });
    });
    it('should verify user otp', async () => {
      const token = jwtHelper.token({
        id: mockUser._id,
        email: SIGNIN_PAYLOAD.email,
        role: STACKHOLDER.USER
      });

      const { statusCode, body } = await agent
        .post('/api/v2/auth/verify-otp')
        .set('Authorization', `Bearer ${token}`)
        .send({
          otp: decrypt(mockOtp.otp)
        })
        .set('Cookie', [
          `hash_otp=${mockOtp.otp}` // <-- No 'express:sess' (Cropped for demo)
        ]);

      expect(statusCode).toBe(httpStatus.OK);

      expect(body.data).toEqual(
        expect.objectContaining({
          isVerified: true
        })
      );
    });
  });

  /* Test: Change password */
  describe('==== Change password ====', () => {
    let mockUser;
    let mockOtp;

    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);
      mockOtp = await AuthService.getEmailOtpService(
        mockUser._id,
        mockUser.email
      );
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
      await deleteOtp({ _id: mockOtp._id });
    });
    it('should change user old password', async () => {
      const token = jwtHelper.token({
        id: mockUser._id,
        email: SIGNIN_PAYLOAD.email,
        role: STACKHOLDER.USER
      });

      const { statusCode } = await agent
        .patch('/api/v2/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: SIGNIN_PAYLOAD.password,
          newPassword: 'e3eh3erbej'
        });

      expect(statusCode).toBe(httpStatus.OK);
    });
  });

  /* Test: get reset password link*/
  describe('==== Get reset password link in email ====', () => {
    let mockUser;

    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);

    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
    });
    it('should send reset oassword link to email', async () => {
      const { statusCode } = await agent
        .post('/api/v2/auth/forgot-password')
        .send({
          email: mockUser.email
        });

      expect(statusCode).toBe(httpStatus.OK);
    });
  });

  /* Test: Reset password */
  describe('==== Reset password ====', () => {
    let mockUser;
    let mockPasswordreset

    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);
      mockPasswordreset = await AuthService.sendPasswordResetLink({
        email: mockUser.email,
        username: mockUser.firstName,
        userId: mockUser._id
      }); 
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
      await deletePasswordResetToke({ _id: mockPasswordreset._id });
    });
    it('should reset password', async () => {
      const tokenData = await findPasswordResetToken({ userId: mockUser._id });

      const { statusCode } = await agent
        .post(`/api/v2/auth/reset-password`)
        .send({
          password: '3nm#ndfn',
          confirmPassword: '3nm#ndfn',
          token: tokenData.token
        });

      expect(statusCode).toBe(httpStatus.OK);
    });
  });

  /* Test: Log out */
  describe('==== Log out ====', () => {
    let mockUser;

    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
    });
    it('should logged out', async () => {
      const token = jwtHelper.token({
        id: mockUser._id,
        email: SIGNIN_PAYLOAD.email,
        role: STACKHOLDER.USER
      });

      const refresh_token = jwtHelper.refresh_token({
        id: mockUser._id,
        email: SIGNIN_PAYLOAD.email,
        role: STACKHOLDER.USER
      });

      const { statusCode } = await agent
        .post('/api/v2/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', [
          `refresh_token=${refresh_token}`
        ]);

      expect(statusCode).toBe(httpStatus.OK);
    });
  });
});

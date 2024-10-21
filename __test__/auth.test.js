const httpStatus = require('http-status')
const { MongoMemoryServer } = require('mongodb-memory-server')
const connection = require('../src/db/connection')
const mongoose = require('mongoose')
const { decrypt } = require('../src/utils/encrypt-decrypt')
const { db } = require('../src/config/env')
const { jwtHelper } = require('../src/helper')
const { STACKHOLDER } = require('../src/enums')
const { findPasswordResetToken } = require('../src/services/password-reset.service')
const AuthService = require('../src/services/auth.service')
const { agent } = require('../src/lib/test')

jest.setTimeout(10000)

describe('==== Authentication test ====', () => {
  // mock data
  const SIGNUP_PAYLOAD = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    password: '12345',
    confirmPassword: '12345'
  };

  const SIGNIN_PAYLOAD = {
    email: 'john@doe.com',
    password: '12345',
    rememberMe: true
  };
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
    it('should return user from db', async () => {
      const { statusCode, body } = await agent
        .post('/api/v2/auth/signup')
        .send(SIGNUP_PAYLOAD);

      if (statusCode == httpStatus.CREATED) userId = body.data._id;
      expect(statusCode).toBe(httpStatus.CREATED);
    });
  });

  /* Test: Sign In */
  describe('==== Sign In ====', () => {

    it('should return token', async () => {
      const userSignInMock = jest
        .spyOn(AuthService, 'loginService')
        .mockResolvedValueOnce({
          token: expect.any(String),
          refresh_token: expect.any(String)
        });

      const { statusCode, body } = await agent
        .post('/api/v2/auth/login')
        .send(SIGNIN_PAYLOAD);

      expect(statusCode).toBe(httpStatus.OK);

      expect(body.data).toEqual(
        expect.objectContaining({
          token: expect.any(String)
        })
      );

      userSignInMock.mockRestore();
    });
  });

  /* Test: Refersh */
  describe('==== Refersh ====', () => {
    it('should return new access token', async () => {
      const refresh_token = jwtHelper.refresh_token({
        id: userId,
        email: SIGNIN_PAYLOAD.email,
        roles: [STACKHOLDER.USER]
      });

      const { statusCode, body } = await agent
        .post('/api/v2/auth/refresh')
        .set('Cookie', [
          `refresh_token=${refresh_token}` // <-- No 'express:sess' (Cropped for demo)
        ]);

      expect(statusCode).toBe(httpStatus.OK);

      expect(body.data).toEqual(
        expect.objectContaining({
          token: expect.any(String)
        })
      );
    });
  });

  /* Test: Get OTP */
  describe('==== Get otp ====', () => {
    it('should return otp', async () => {
      const token = jwtHelper.token({
        id: userId,
        email: SIGNIN_PAYLOAD.email,
        roles: [STACKHOLDER.USER]
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
    it('should return own otp', async () => {
      const token = jwtHelper.token({
        id: userId,
        email: SIGNIN_PAYLOAD.email,
        roles: [STACKHOLDER.USER]
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
    it('should verify user otp', async () => {
      const token = jwtHelper.token({
        id: userId,
        email: SIGNIN_PAYLOAD.email,
        roles: [STACKHOLDER.USER]
      });

      const newOtpMock = await AuthService.getEmailOtpService(
        userId,
        SIGNIN_PAYLOAD.email
      );

      const { statusCode, body } = await agent
        .post('/api/v2/auth/verify-otp')
        .set('Authorization', `Bearer ${token}`)
        .send({
          otp: decrypt(newOtpMock.otp)
        })
        .set('Cookie', [
          `hash_otp=${newOtpMock.otp}` // <-- No 'express:sess' (Cropped for demo)
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
    it('should change user old password', async () => {
      const token = jwtHelper.token({
        id: userId,
        email: SIGNIN_PAYLOAD.email,
        roles: [STACKHOLDER.USER]
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
    it('should send reset oassword link to email', async () => {
      const { statusCode } = await agent
        .post('/api/v2/auth/forgot-password')
        .send({
          email: SIGNIN_PAYLOAD.email
        });

      expect(statusCode).toBe(httpStatus.OK);
    }, 30000);
  });

  /* Test: Reset password */
  describe('==== Reset password ====', () => {
    it('should reset password', async () => {
      const tokenData = await findPasswordResetToken({ userId });

      const { statusCode } = await agent
        .post(`/api/v2/auth/reset-password?token=${tokenData.token}`)
        .send({
          password: '3nm#ndfn',
          confirmPassword: '3nm#ndfn'
        });

      expect(statusCode).toBe(httpStatus.OK);
    }, 30000);
  });

  /* Test: Log out */
  describe('==== Log out ====', () => {
    it('should logged out', async () => {
      const token = jwtHelper.token({
        id: userId,
        email: SIGNIN_PAYLOAD.email,
        roles: [STACKHOLDER.USER]
      });

      const refresh_token = jwtHelper.refresh_token({
        id: userId,
        email: SIGNIN_PAYLOAD.email,
        roles: [STACKHOLDER.USER]
      });

      const { statusCode } = await agent
        .post('/api/v2/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .set('Cookie', [
          `refresh_token=${refresh_token}` // <-- No 'express:sess' (Cropped for demo)
        ]);

      expect(statusCode).toBe(httpStatus.OK);
    });
  });
})

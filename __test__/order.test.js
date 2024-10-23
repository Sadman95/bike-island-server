const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const { agent } = require('../src/lib/agent');
const { STACKHOLDER } = require('../src/enums');
const { jwtHelper } = require('../src/helper');
const connection = require('../src/db/connection');
const { db } = require('../src/config/env');
const AuthService = require('../src/services/auth.service');
const { SIGNUP_PAYLOAD, ORDER_PAYLOAD } = require('../__mock__');
const { deleteUserByIdService } = require('../src/services/user.service');
const { findAllCycles } = require('../src/services/cycle.service');
const { createOrderService, deleteOrderService } = require('../src/services/order.service');


jest.setTimeout(10000)


describe(' =============== Order API Tests ================ ', () => {
    // mock data
  let mongoServer;
  let uri;
    let userToken;
    let adminToken;
  let orders;

  beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create({
      replSet: { count: 2 }
    });
    uri = mongoServer.getUri();
      await connection(uri, db.name)
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
      jest.clearAllMocks();
  });

  describe('POST /api/v2/orders', () => {
    let mockUser;
    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService(SIGNUP_PAYLOAD);
      userToken = jwtHelper.token({
        id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role
      });
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
    });
    it('should create a new order for verified users', async () => {
      

      const res = await agent
        .post('/api/v2/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(ORDER_PAYLOAD);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.totalAmount).toBe(ORDER_PAYLOAD.totalAmount);
    });
  });

  describe.only('GET /api/v2/orders', () => {
    let mockUser;
    let mockOrder;
    beforeEach(async () => {
      mockUser = await AuthService.userSignUpService({
        firstName: 'Jack',
        lastName: 'Sparrow',
        email: 'jack@gmail.com',
        password: '12345',
        confirmPassword: '12345',
        isVerified: true,
        role: STACKHOLDER.ADMIN
      });
      adminToken = jwtHelper.token({
        id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role
      });

      let { address, ...order } = ORDER_PAYLOAD
      address.user = mockUser._id
      order.user = mockUser._id;

      mockOrder = await createOrderService({address, ...order});
    });

    afterEach(async () => {
      // Clean up: delete all users after each test to prevent conflicts in future tests
      await deleteUserByIdService(mockUser._id);
      await deleteOrderService({ _id: mockOrder._id });
    });
    it('should retrieve all orders for admin', async () => {
      const res = await agent
        .get('/api/v2/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 403 for non-admin users', async () => {
      const res = await agent
        .get('/api/v2/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/v2/orders/self', () => {
    it('should retrieve user-specific orders', async () => {
      const res = await agent
        .get('/api/v2/orders/self')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  describe('PUT /api/v2/orders/:id', () => {
    it('should cancel a pending order by its ID', async () => {
      const mockOrder = new Order({
        user: mongoose.Types.ObjectId(),
        items: [
          {
            product: mongoose.Types.ObjectId(),
            quantity: 1,
            price: 100
          }
        ],
        totalAmount: 100,
        status: ORDER_STAT.PENDING
      });

      await mockOrder.save();

      const res = await agent
        .put(`/api/v2/orders/${mockOrder._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe(ORDER_STAT.CANCELED);
    });
  });

  describe('DELETE /api/v2/orders/:id', () => {
    it('should delete an order by its ID', async () => {
      const mockOrder = new Order({
        user: mongoose.Types.ObjectId(),
        items: [
          {
            product: mongoose.Types.ObjectId(),
            quantity: 1,
            price: 100
          }
        ],
        totalAmount: 100,
        status: ORDER_STAT.PENDING
      });

      await mockOrder.save();

      const res = await agent
        .delete(`/api/v2/orders/${mockOrder._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Order deleted successfully!');
    });
  });

  describe('POST /api/v2/orders/bulk-delete', () => {
    it('should bulk delete orders for admin', async () => {
      const orderIds = [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()];

      const res = await agent
        .post('/api/v2/orders/bulk-delete')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ids: orderIds });

      expect(res.statusCode).toBe(200);
      expect(res.body.deletedCount).toBe(orderIds.length);
    });
  });
});

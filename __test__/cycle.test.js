const { Types, default: mongoose } = require('mongoose');
const httpStatus = require('http-status');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { jwtHelper } = require('../src/helper');
const { STACKHOLDER } = require('../src/enums');
const connection = require('../src/db/connection');
const { db } = require('../src/config/env');
const { agent } = require('../src/lib/test');

jest.setTimeout(10000);

describe('==== Cycles ====', () => {
  // Mock data

  const USER_ID = new Types.ObjectId().toString();

  let token = jwtHelper.token({
    id: USER_ID,
    email: 'johndoe@gmail.com',
    role: STACKHOLDER.ADMIN,
  });

  let mongoServer;
  let uri;
  let cycle;

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

  // Test: create new cycle
  describe('POST /api/v2/cycles', () => {


   const PAYLOAD = {
     productTitle: 'Mountain Bike',
     productDesc: 'Mountain Bike is awesome to ride',
     brand: 'Hero',
     type: 'Gear',
     productImg:
       'https://img.freepik.com/free-vector/bicycle-cartoon-isolated_1308-27560.jpg?size=626&ext=jpg&ga=GA1.1.885695879.1720685552&semt=ais_hybrid',
     productPrice: 1200
   };

    it('should create a new cycle', async () => {
      const response = await agent
        .post('/api/v2/cycles')
        .set('Authorization', `Bearer ${token}`)
        .send(PAYLOAD);

      const { statusCode, body } = response;
      if (statusCode == httpStatus.CREATED) cycle = body.data;

      expect(statusCode).toBe(httpStatus.CREATED);
      expect(body.data).toEqual(
        expect.objectContaining({
          productTitle: PAYLOAD.productTitle
        })
      );
    }, 3000);
  });

  // Test: get created cycles
  describe('GET /api/v2/cycles', () => {
    it('should return campigns', async () => {
      const response = await agent
        .get('/api/v2/cycles')
        .set('Authorization', `Bearer ${token}`);

      const { statusCode, body } = response;

      expect(statusCode).toBe(httpStatus.OK);
      expect(body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            // createdBy: jwtHelper.verifyUserSecret(token).id,
            _id: expect.any(String)
          })
        ])
      );
    }, 30000);
  });

  // Test: delete a cycle
  describe('DELETE /api/v2/cycles/:id', () => {
    it('shoud delete a cycle', async () => {
      const response = await agent
        .delete(`/api/v2/cycles/${cycle._id}`)
        .set('Authorization', `Bearer ${token}`);

      const { statusCode } = response;

      expect(statusCode).toBe(httpStatus.OK);
    });
  });
});

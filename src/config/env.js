const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env') });

module.exports = {
  app_name: process.env.APP_NAME,
  env: process.env.NODE_ENV,
  db: {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    uri: process.env.MONGO_URI,
    name: process.env.DB_NAME,
    test_uri: process.env.TEST_DB_URI,
    test_dbname: process.env.TEST_DB_NAME,
  },
    salt_round: 12,
  mail_config: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  },
  jwtoken: {
    secret: process.env.JWT_SECRET,
    secret_exp: process.env.JWT_EXPIRATION,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_secret_exp: process.env.JWT_REFRESH_EXPIRATION
  },
  api: {
    title: process.env.API_TITLE,
    version: process.env.API_VERSION
  },
  server: {
    port: process.env.PORT,
    test_port: process.env.TEST_PORT,
    baseURL: process.env.BASE_URL
  },
  auth0: {
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.SESSION_SECRET
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET
  },
  client_url:
    process.env.NODE_ENV == 'development'
      ? process.env.CD_URL
      : process.env.CI_URL
};

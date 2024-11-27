const OTP = require("../models/otp.model")


/**
 * @class
*/
class OtpService{
/**
 * @summary Find OTP by property
 * @param {Record<string, any>} filter
 * @returns {Promise<Document>}
 */
static async findOtp (filter) {
  const otp = await OTP.findOne(filter)
    .populate([
      {
        path: 'userId',
        select: 'email',       
      }
    ])
    .lean();
  return otp
}

/**
 * @summary Delete OTP by property
 * @param {Record<string, any>} filter
 */
static async deleteOtp (filter) {
  await OTP.deleteOne(filter)
}
}


module.exports = OtpService

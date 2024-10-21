const PasswordReset = require('../models/password-reset.model');

/**
 * @class
 */
class PasswordresetService {
  /**
   * @summary Find token data by property
   * @param {Record<string, any>} filter
   * @returns {Promise<Document>}
   */
  static async findPasswordResetToken(filter) {
    const tokenData = await PasswordReset.findOne(filter);

    return tokenData;
  }
  
  /**
   * @summary Delete token data by property
   * @param {Record<string, any>} filter
   */
  static async deletePasswordResetToke(filter) {
    await PasswordReset.deleteOne(filter);
  }
}

module.exports = PasswordresetService;

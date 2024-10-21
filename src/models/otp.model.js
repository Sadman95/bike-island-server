// otp schema
const { Schema, model } = require('mongoose')

// otp schema
const otpSchema = new Schema({
  otp: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
})

// static method to check otp exist
otpSchema.static('isOtpExist', async function (key, value) {
  return OTP.findOne({ [key]: value }).lean()
})

// pre-save middleware to invalidate otp
otpSchema.pre('save', async function (next) {
  const otp = this

  try {
    const invalidatedOtp = await OTP.findOne({
      userId: otp.userId,
      expiresAt: { $lt: Date.now().toString() },
    })

    if (invalidatedOtp) {
      await OTP.deleteOne({ _id: invalidatedOtp._id })
    }

    next()
  } catch (error) {
    next(error)
  }
})

// otp model
const OTP = model('OTP', otpSchema)

module.exports = OTP

const { Schema, model } = require("mongoose");

const passwordResetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
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


// pre-save middleware to invalidate password reset
passwordResetSchema.pre('save', async function (next) {
  const passwordReset = this

  try {
    const invalidatedPasswordReset = await PasswordReset.findOne({
      userId: passwordReset.userId,
      expiresAt: { $lt: Date.now() },
    })

    if (invalidatedPasswordReset) {
      await PasswordReset.deleteOne({ _id: invalidatedPasswordReset._id })
    }

    next()
  } catch (error) {
    next(error)
  }
})

// PasswordReset model
const PasswordReset = model('PasswordReset', passwordResetSchema)

module.exports = PasswordReset
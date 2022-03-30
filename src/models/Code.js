const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    code: {
      type: String,
      required: [true, 'code is Required'],
    },
    expiresIn: {
      type: Date,
      required: [true, 'expiresIn Date is Required'],
    },
    status: {
      type: String,
      enum: ['allowed', 'notAllowed'],
      required: [true, 'status is Required'],
      default: 'allowed',
    },
  },
  {
    timestamps: true,
  }
);

codeSchema.pre(/^find/, function (next) {
  this.sort('-createdAt');
  next();
});

const Code = mongoose.model('Code', codeSchema);
module.exports = Code;

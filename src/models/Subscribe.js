const mongoose = require('mongoose');
const validator = require('validator');

const subscribeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
  },
  {
    timestamps: true,
  }
);

const Subscribe = mongoose.model('Subscribe', subscribeSchema);
module.exports = Subscribe;

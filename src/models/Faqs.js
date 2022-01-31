const mongoose = require('mongoose');
const validator = require('validator');

const faqsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    answer:{
      type: String,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    }
  },
  {
    timestamps: true,
  }
);

const Faqs = mongoose.model('Faqs', faqsSchema);
module.exports = Faqs;

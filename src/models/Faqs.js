const mongoose = require('mongoose');
const validator = require('validator');

const faqsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
    },
    answer: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Faqs = mongoose.model('Faqs', faqsSchema);
module.exports = Faqs;

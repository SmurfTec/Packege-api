const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeliveryRequest: Boolean,
    title: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'must required a title'],
    },
    from: String,
    to: String,
    description: String,
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    weightFrom: Number,
    weightTo: Number,

    //* Dimensions
    length: Number,
    breadth: Number,
    height: Number,
    //
    urgent: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: [true, `Please Provide `],
    },

    deliveryDate: Date,
    amountFrom: Number,
    amountTo: Number,
    negotiate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

postSchema.pre(/^find/, function (next) {
  this.sort('-createdAt');
  next();
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'categories',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

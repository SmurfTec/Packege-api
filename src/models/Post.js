const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeliveryRequest: Boolean,
    from: {
      type: String,
      enum: [
        'Bangladesh',
        'India',
        'Kenya',
        'Nigeria',
        'Philippines',
        'Romania',
        'Spain',
        'UK',
      ],
    },
    to: {
      type: String,
      enum: [
        'Bangladesh',
        'India',
        'Kenya',
        'Nigeria',
        'Philippines',
        'Romania',
        'Spain',
        'UK',
      ],
    },
    description: String,
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],

    weight: Number,
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
  }).populate({ path: 'user' });
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

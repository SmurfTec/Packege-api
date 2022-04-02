const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // * Receiver will be 2nd person of chat
    text: String,

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  { timestamps: true }
);

messageSchema.pre(/^find/, function (next) {
  this.sort('-createdAt');
  next();
});

messageSchema.pre(/^find/, function (next) {
  this.populate({ path: 'sender', select: 'firstName lastName image' });
  next();
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

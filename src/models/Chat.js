const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  { timestamps: true }
);

// chatSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'participants',
//     select: 'name photo firstName lastName',
//   }).populate({ path: 'messages' });
//   next();
// });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

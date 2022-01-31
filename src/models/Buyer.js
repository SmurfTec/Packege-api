const mongoose = require('mongoose');
const User = require('./User');

const buyerSchema = new mongoose.Schema({
  productFavourites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
  serviceFavourites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
    },
  ],
  orders: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
    },
  ],
});

const Buyer = User.discriminator('Buyer', buyerSchema);
module.exports = Buyer;

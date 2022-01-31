const mongoose = require('mongoose');
const User = require('./User');

const vendorSchema = new mongoose.Schema({
  bannerImage: String,
  Address: String,
});

const Vendor = User.discriminator('Vendor', vendorSchema);
module.exports = Vendor;

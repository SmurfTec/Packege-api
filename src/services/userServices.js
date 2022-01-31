const User = require('../models/User');
const Buyer = require('../models/Buyer');
const Vendor = require('../models/Vendor');
const Contact = require('../models/Contact');
const Subscribe = require('../models/Subscribe');
const AppError = require('../helpers/appError');

class UserServices {
  //* USERS
  static async Users(query) {
    const { role } = query;
    let queryData = User.find();
    if (role) queryData.find({ role });
    const users = await queryData;
    return { users };
  }

  //* ME
  static async Me(userId) {
    const user = await User.findById(userId);
    return { user };
  }

  //* USER
  static async User(userId, next) {
    const user = await User.findOne(userId);

    if (!user)
      return next(new AppError(`No User found against id ${userId}`, 404));

    return { user };
  }

  //* UPDATEME
  static async UpdateMe(userId, body, role, next) {
    let updatedUser;
    if (role === 'buyer') {
      updatedUser = await Buyer.findByIdAndUpdate(
        userId,
        { ...body },
        {
          runValidators: true,
          new: true,
        }
      );
    } else if (role === 'vendor') {
      updatedUser = await Vendor.findByIdAndUpdate(
        userId,
        { ...body },
        {
          runValidators: true,
          new: true,
        }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...body },
        {
          runValidators: true,
          new: true,
        }
      );
    }

    if (!updatedUser)
      return next(new AppError(`Can't find any user with id ${userId}`, 404));

    return { updatedUser };
  }

  //* DELETEME
  static async DeleteUser(userId, next) {
    const deletedUser = await User.findOneAndDelete(userId);

    if (!deletedUser)
      return next(new AppError(`No User found against id ${userId}`, 404));

    return { deletedUser };
  }

  //* CREATE-CONTACTS
  static async createContact(userData) {
    const { email, message, name } = userData;

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    return { contact };
  }

  //* GET-CONTACTS
  static async getContacts() {
    const contacts = await Contact.find();
    return { contacts };
  }

  //* SUBSCRIBE
  static async Subscribe(userData) {
    const subscribe = await Subscribe.create(userData);
    return { subscribe };
  }
}

module.exports = UserServices;

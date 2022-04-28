const User = require('../models/User');
const Contact = require('../models/Contact');
const Faq = require('../models/Faqs');
const Subscribe = require('../models/Subscribe');
const Code = require('../models/Code');
const AppError = require('../helpers/appError');
const { v1: uuidv1 } = require('uuid');
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
  static async UpdateMe(userId, body, next) {
    console.log('body', body);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...body },
      {
        runValidators: true,
        new: true,
      }
    );

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

  //* CREATE-FAQ
  static async createFaq(userData) {
    const faq = await Faq.create(userData);
    return { faq };
  }

  //* GET-FAQs
  static async getFaqs() {
    const faqs = await Faq.find();
    return { faqs };
  }

  //*
  static async UpdateFaq(Id, body, next) {
    const faq = await Faq.findByIdAndUpdate(
      Id,
      { ...body },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!faq)
      return next(new AppError(`Can't find any Faq with id ${Id}`, 404));

    return { faq };
  }

  //*
  static async DeleteFaq(Id, next) {
    const faq = await Faq.findOneAndDelete(Id);

    if (!faq) return next(new AppError(`No Faq found against id ${Id}`, 404));

    return { faq };
  }

  //* SUBSCRIBE
  static async Subscribe(userData) {
    const subscribe = await Subscribe.create(userData);
    return { subscribe };
  }

  //* CODE
  static async Code(userId) {
    let expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 1);

    const code = await Code.create({
      user: userId,
      code: uuidv1(),
      expiresIn,
    });

    return { code };
  }

  static async Codes() {
    const codes = await Code.find();
    return { codes };
  }
}

module.exports = UserServices;

const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const baseOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ['Mr', 'Mr.s'],
    },
    image: String,
    contact: Number,
    firstName: {
      type: String,
      trim: true,
      maxlength: [20, 'firstname must be less than or equal to 20'],
      minlength: [3, 'firstname must be greater than 3'],
      // unique: true,
      // required: [true, 'Please tell us your firstname!'],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [20, 'lastname must be less than or equal to 20'],
      minlength: [3, 'lastname must be greater than 3'],
      // unique: true,
      // required: [true, 'Please tell us your lastname!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: [true, `Please Provide Role`],
      default: 'user',
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
      required: [true, 'Please provide a password'],
    },
    passwordConfirm: {
      type: String,
      validate: {
        // This only works on CREATE and SAVE!!!
        validator(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
      // required: [true, 'Please confirm your password'],
    },

    activationLink: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    activated: {
      type: Boolean,
      default: true, // make it false in production
    },

    //* SocaialLogings
  },
  baseOptions
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Encrpt the password ad Presave it
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //  only run if password is modified
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12); // hashing password
  this.passwordConfirm = undefined; // delete passwordConfirm field
  next();
});

userSchema.methods.createAccountActivationLink = function () {
  const activationToken = crypto.randomBytes(32).toString('hex');
  // console.log(activationToken);
  this.activationLink = crypto
    .createHash('sha256')
    .update(activationToken)
    .digest('hex');
  // console.log({ activationToken }, this.activationLink);
  return activationToken;
};

// comparing password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log(candidatePassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  console.log(resetToken);

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

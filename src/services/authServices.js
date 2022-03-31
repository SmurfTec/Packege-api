const User = require('../models/User');
const Code = require('../models/Code');
const sendMail = require('../helpers/email');
const AppError = require('../helpers/appError');

class AuthServices {
  //* SIGNUP
  static async signup(userData, query, next) {
    let user;

    console.log('Query :>> ', query);

    //* check if there is any code give points to the new user and sign up users
    if (query.code) {
      console.log('if');
      const { code } = query;
      let shareCode = await Code.findOne({ code: code });
      //check that code is expires or not
      console.log('shareCode', shareCode);

      let today = new Date();
      let expires = new Date(shareCode.expiresIn);
      if (today >= expires || shareCode.status === 'notAllowed') {
        return next(new AppError('Code is Expired'), 400);
      }
      // if everuthing is okay with code
      let points = 10;
      let requestedUser = await User.findById(shareCode.user);
      requestedUser.points += points;
      await requestedUser.save();

      shareCode.status = 'notAllowed';
      await shareCode.save();

      user = await User.create({
        ...userData,
        points: points,
      });
      const activationToken = user.createAccountActivationLink();
      user.save({ validateBeforeSave: false });
      // 4 Send it to Users Email
      const activationURL = `http://localhost:6000/api/users/confirmMail/${activationToken}`;
      // let activationURL = `${req.headers.origin}/confirmMail/${activationToken}`;
      const message = `GO to this link to activate your App Account : ${activationURL} .`;
      sendMail({
        email: user.email,
        message,
        subject: 'Your Account Activation Link for Package App !',
        user,
        template: 'signupEmail.ejs',
        url: activationURL,
      });
    }
    //* Simple SignUp
    else {
      console.log('else');
      user = await User.create(userData);
      // Generate Account Activation Link
      const activationToken = user.createAccountActivationLink();
      user.save({ validateBeforeSave: false });
      // 4 Send it to Users Email
      const activationURL = `http://localhost:6000/api/users/confirmMail/${activationToken}`;
      // let activationURL = `${req.headers.origin}/confirmMail/${activationToken}`;
      const message = `GO to this link to activate your App Account : ${activationURL} .`;
      sendMail({
        email: user.email,
        message,
        subject: 'Your Account Activation Link for Package App !',
        user,
        template: 'signupEmail.ejs',
        url: activationURL,
      });
    }

    return { user };
  }

  //* LOGIN
  static async login(userData, next) {
    // console.log('USER', userData);
    const { email, password } = userData;
    if (!email || !password) {
      //  check email and password exist
      return next(new AppError(' please proveide email and password ', 400));
    }
    const user = await User.findOne({ email }).select('+password'); // select expiclity password
    if (!user)
      return next(new AppError(`No User found against email ${email}`, 404));

    console.log(`user.role`, user.role);

    if (
      !user || // check user exist and password correct
      !(await user.correctPassword(password, user.password))
    ) {
      // candinate password,correctpassword
      return next(new AppError('incorrect email or password', 401));
    }

    console.log(`user`, user);

    if (user.activated === false)
      return next(
        new AppError(
          `Plz Activate your email by then Link sent to your email ${user.email}`,
          401
        )
      );

    // * If request is coming from admin side, then only admins are allowed to login
    // console.log('req.headers.origin', req.headers.origin);
    // if (req.headers.origin === adminDomain) {
    //   // * Only Admin Can login from this domain
    //   if (user.role !== 'admin')
    //     return next(new AppError('You are NOT authorized to login ', 403));
    // } else if (user.role !== 'user') {
    //   // * Only Users Can login from this domain
    //   return next(new AppError('You are NOT authorized to login ', 403));
    // }

    return { user };
  }

  //* CONFIRM-EMAIL
  static async confirmMail(hashedToken, next) {
    const user = await User.findOne({
      activationLink: hashedToken,
    });

    if (!user)
      return next(new AppError(`Activation Link Invalid or Expired !`));

    // 3 Activate his Account
    user.activated = true;
    user.activationLink = undefined;
    await user.save({ validateBeforeSave: false });
    return;
  }

  //* FORGOT-PASSWORD
  static async forgotPassword(userData, origin, next) {
    console.log('origin', origin);

    const { email } = userData;
    if (!email)
      return next(new AppError(`Plz provide Email with request`, 400));

    // 2 Check If User Exists with this email
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user)
      return next(
        new AppError(`No User Found against this Email : ${email}`, 400)
      );

    // 3 Create Password Reset Token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    let resetURL = `${origin}/resetPassword/${resetToken}`;
    console.log('resetToken :>> ', resetToken);
    // const resetURL = `http://localhost:3000/confirmMail/${resetToken}`;
    const message = `Forgot Password . Update your Password at this link ${resetURL} if you actually request it
   . If you did NOT forget it , simply ignore this Email`;

    sendMail({
      email,
      message,
      subject: 'Your Password reset token (will expire in 20 minutes)',
      user,
      template: 'forgotPassword.ejs',
      url: resetURL,
    });

    return { email };
  }

  //* RESET-PASSWORD
  static async resetPassword(userData, hashedToken, next) {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    // 2 Check if user still exists and token is NOT Expired
    if (!user)
      return next(new AppError(`Reset Password Link Invalid or Expired !`));

    // 3 Change Password and Log the User in
    const { password, passwordConfirm } = userData;

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    return { user };
  }

  //* UPDATEPASSWORD
  static async updatePassword(userData, userId, next) {
    const { password, passwordConfirm, passwordCurrent } = userData;
    // 1) get user from collection
    const user = await User.findById(userId).select('+password');

    // 2) check if posted current Password is Correct
    if (!(await user.correctPassword(passwordCurrent, user.password))) {
      // currentpass,db pass
      return next(new AppError(' Your current password is wrong', 401));
    }

    // 3) if so update the  password
    user.password = password;
    user.passwordConfirm = passwordConfirm;

    await user.save();
    return {};
  }
}

module.exports = AuthServices;

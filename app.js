require('./src/services/passportService');
const passport = require('passport');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const cookieSession = require('cookie-session');
const request = require('request');

const app = express();

const userRouter = require('./src/routers/userRouter');
const authRouter = require('./src/routers/authRouter');
const categoryRouter = require('./src/routers/categoryRouter');
const postRouter = require('./src/routers/postRouter');

// const contactRouter = require('./src/routers/contactRouter');
// const faqRouter = require('./src/routers/faqRouter');

const globalErrorHandler = require('./src/middlewares/globalErrorHandler');
const AppError = require('./src/helpers/appError');

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  cookieSession({
    name: 'session',
    keys: ['lama'],
    maxAge: 24 * 60 * 60 * 100,
  }) // maxAge is 1day
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

console.log(process.env.NODE_ENV);
// set security http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// $ CORS
app.use(cors());

//* this will go to env
// clients=["https://rei-client.herokuapp.com","http://rei-client.herokuapp.com", "https://app.reithinkmedia.com"]

// var corsOptions = {
//   origin: JSON.parse(process.env.clients),
//   optionsSuccessStatus: 200,
//   methods: "GET, POST, DELETE, PUT",
// };
// app.use(cors(corsOptions));

//  set limit request from same API in timePeroid from same ip
// const limiter = rateLimit({
//   max: 100, //   max number of limits
//   windowMs: 60 * 60 * 1000, // hour
//   message: ' Too many req from this IP , please Try  again in an Hour ! ',
// });

// app.use('/api', limiter);

//  Body Parser  => reading data from body into req.body protect from scraping etc
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSql query injection
app.use(mongoSanitize()); //   filter out the dollar signs protect from  query injection attact

// Data sanitization against XSS
app.use(xss()); //    protect from molision code coming from html

// routes

app.post('/api/mailchimp', async (req, res, next) => {
  const { subscribe } = req.body;

  // console.log('subscribe', subscribe);
  // construct request data
  const data = {
    members: [{ email_address: subscribe, status: 'subscribed' }],
  };

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us14.api.mailchimp.com/3.0/lists/38f732a772',
    method: 'POST',
    headers: {
      Authorization: 'auth 0f0013ebd162f05a9c549a8a82fdc932-us14',
    },
    body: postData,
  };

  request(options, (err, response, body) => {
    if (err) {
      res.status(400).json({
        status: 'fail',
      });
    } else {
      if (response.statusCode === 200) {
        res.status(200).json({
          status: 'success',
          subscribe,
        });
      } else {
        res.status(400).json({
          status: 'fail',
        });
      }
    }
  });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/category', categoryRouter);

// handling all (get,post,update,delete.....) unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;

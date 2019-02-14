const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const session = require('cookie-session'); // we're using 'express-session' as 'session' here
const passport = require('passport');

// Initiate app
const app = express();

// Import Routes
const router = require('./routes');

const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

// Configure app
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'example.com',
      path: 'foo/bar',
      expires: expiryDate,
    },
  }),
);

// Passport initialize.
app.use(passport.initialize());
app.use(passport.session());


function errorNotification(err, str, req) {
  const title = `Error in ${req.method} ${req.url}`;
  notifier.notify({
    title,
    message: str,
  });
}

if (process.env.NODE_ENV !== 'production') {
// only use in development
  app.use(errorHandler({ log: errorNotification }));
}

// Routes
app.use('/api', router);

module.exports = app;
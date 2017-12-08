var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const bearerToken = require("express-bearer-token");
const passport = require('passport');
const APIKeyStrategy = require('passport-localapikey');

var app = express();
let env = process.env.NODE_ENV || "development";
app.set("secret", process.env.SECRET);
app.set("appId", process.env.APPID);
app.set("apiKeySecret",process.env.API_KEY_SECRET);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bearerToken());



require('./routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {

  if (env === "development") {
    console.log(err.stack)
  }
  res.status(err.status || 500);
  res.end(err.message);
});

module.exports = app;

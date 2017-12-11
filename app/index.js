var express = require('express');
var path = require('path');
var morgan = require('morgan');
var winston = require('winston');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const bearerToken = require("express-bearer-token");
var app = express();

let env = process.env.NODE_ENV || "development";
app.set("secret", process.env.SECRET);
app.set("appId", process.env.APPID);
app.set("apiKeySecret", process.env.API_KEY_SECRET);


var accessLog = fs.createWriteStream(path.join(__dirname, "../", 'logs', `access.${env}.log`), { flags: 'a' })


var logger = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: path.join(__dirname, "../", 'logs', `error.log`) })
  ]
});


app.use(morgan('combined', {
  stream: accessLog
}));
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

  logger.error(err.message);
  res.status(err.status || 500);
  res.end(err.message);
});

module.exports = app;

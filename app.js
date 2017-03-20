var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.json');

var aws4 = require('aws4');
var request = require('request');

var index = require('./routes/index');
var users = require('./routes/users');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.raw());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use (function(req, res, next) {
  var data='';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    req.body = data;
    next();
  });
});


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  //copy header from request
  header = req.headers;
  //replace host option in header
  delete header['host'];
  console.log(header);
  opt = {};
  opt['uri'] = config.protocol + '://' + config.target + req.url;
  opt['headers'] = header;
  opt['body'] = req.body;
  opt['method'] = req.method;
  opt['aws'] = {key: config.access_key, secret: config.secret_key, sign_version: 4};
  console.log(opt);
  console.log(typeof(opt['body']));
  //setting body and uri
  request(opt, function(error, reply){
    console.log(reply.body);
    res.status(reply.statusCode).send(reply.body);
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

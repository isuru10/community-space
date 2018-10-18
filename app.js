var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//---------------------add extra Routers
// var employeeRouter = require('./routes/employeeRouter');
var customerRouter = require('./routes/customerRouter');
var modelRouter = require('./routes/modelRouter');
var parkingLotRouter = require('./routes/parkingLotRouter');
//--------------------------------------

//use mongoose for database schema development 
//and bluebird for promise handling
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//---------------------add schemas
// const Employees = require('./models/employees');
const Customer = require('./models/customer')
//--------------------------------

//establishing db connection --------localhost-------------
const url = 'mongodb://localhost:27017/parkingDB';

const connect = mongoose.connect(url,{
  useMongoClient:true
}); 

connect.then((db)=>{
  console.log('Connection successful');
},(err)=>{console.log(err);});
//---------------------------------------------------------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Add headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//------------------basic Authentication------------------------------- TODO: NOT WORKING
function auth (req, res, next) {
  console.log(req.headers.authorization);
  var authHeader = req.headers.authorization;
  if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
  }
  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  if (user == 'admin' && pass == 'password') {
      next(); // authorized
  } else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      next(err);
  }
  next();
}
// app.use(auth);
//-----------------------------------------------------------------------------
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/employees',employeeRouter);
app.use('/customers', customerRouter);
app.use('/models', modelRouter);
app.use('/parkinglots', parkingLotRouter);

app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var countRouter = require('./routes/count');
var adminRouter = require('./routes/admin');
var adminRestaurantRouter = require('./routes/adminRestaurant');
var usersRouter = require('./routes/users');
var clientsRouter = require('./routes/clients');
var saucerfoodRouter = require('./routes/saucerFood');
var restaurantsRouter = require('./routes/restaurants');
var reservationRouter = require('./routes/reservation');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '1q2w3e4r',
  resave: false,
  saveUninitialized: true
}));
app.use(function(req, res, next){
	res.locals.session = req.session;
	next();
});

app.use('/', indexRouter);
app.use('/count', countRouter);
app.use('/admin', adminRouter);
app.use('/client/reservations', clientsRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/restaurants', restaurantsRouter);
app.use('/admin/reservations', reservationRouter);
app.use('/admin/saucerFoods', saucerfoodRouter);
app.use('/adminRestaurant', adminRestaurantRouter);

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

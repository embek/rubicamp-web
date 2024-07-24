var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/dashboard');
var loginRouter = require('./routes/login')
var usersRouter = require('./routes/users');
var logoutRouter = require('./routes/logout');
var unitsRouter = require('./routes/units');
const { isLoggedIn } = require('./helpers/util');

var app = express();
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'ayamgoreng',
  resave: false,
  saveUninitialized: true
}))

app.use('/', loginRouter);
app.use('/dashboard', isLoggedIn, indexRouter);
app.use('/users', isLoggedIn, usersRouter);
app.use('/logout', logoutRouter);
app.use('/units', isLoggedIn, unitsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

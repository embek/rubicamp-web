var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');
const cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

async function main() {
  const url = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(url);
  const dbName = 'workdb';
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  return db;
}

main().then(async db => {
  // var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users')(db);
  var todosRouter = require('./routes/todos')(db);

  app.get('/', (req, res) => res.render('users'));
  app.get('/user/:userid/todos', (req, res) => res.render('todos', { executor: req.params.userid }))
  app.use('/users', usersRouter);
  app.use('/todos', todosRouter);

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
  })
}).catch(error => {
  console.log('gagal baca db', error)
})

module.exports = app;
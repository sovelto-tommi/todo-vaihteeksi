const config = require('./config')

const express = require('express');
const createError = require('http-errors')
const path = require('path');
const morgan = require('morgan');

const router = require('./routes/todoroutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/todos', router);

app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  if (config.app.development) {
    res.locals.error = err
    res.locals.stack = err.stack.split('\n')
  }
  // render the error page
  res.status(err.status || 500)
  res.json(res.locals)
})

module.exports = app;

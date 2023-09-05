var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override')
// const session = require('express-session')
const session = require('cookie-session');
const Keygrip = require('keygrip');
const flash = require('connect-flash');
var cors = require('cors')
const config = require('./config')

var userRouter = require('./app/user/router');
var scrapRouter = require('./app/scrape/router');
var skillRouter = require('./app/skill/router');
var sentimentRouter = require('./app/sentiment/router');

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(session({
//   secret: config.sessionKey,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {}
// }))

app.use(session({
  name: 'session',
  keys: new Keygrip([config.sessionKey], 'SHA384')
}))

app.use(flash());
app.use(methodOverride('_method'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin', express.static(path.join(__dirname, '/node_modules/startbootstrap-sb-admin-2/')));

app.use('/', userRouter);
app.use('/scrape', scrapRouter);
app.use('/up-skill', skillRouter);
app.use('/sentiment', sentimentRouter);

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

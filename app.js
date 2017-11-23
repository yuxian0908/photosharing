var config = require('./config/config'),
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    compress = require('compression');

var index = require('./app/routes/index');
var users = require('./app/routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}

// 設定api資料傳輸的middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

// Configure the 'session' middleware
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: config.sessionSecret,
  cookie: { maxAge: 60 * 1000 }
}));

// Configure the flash messages middleware
app.use(flash());

app.use(cookieParser());

// 設定靜態檔案路徑
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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
    compress = require('compression'),
    Passport = require('passport'),
    multer = require('multer');

var mongoose = require('./config/mongoose'),
    redis = require('./config/redis'),
    passport = require('./config/passport'),
    box = require('./config/box')();

var app = express();

box.users.get(box.CURRENT_USER_ID)
    .then(user => console.log('Hello', user.name, '!'))
    .catch(err => console.log('Got an error!', err));


app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Create a new database connection instance
var db = mongoose();
var client = redis();

// view engine setup
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'jade');

// uncomment after placing favicon in /public
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
  cookie: { maxAge: 60 * 10000 }
}));

// Configure the flash messages middleware
app.use(flash());

app.use(cookieParser());

// 設定靜態檔案路徑
app.use(express.static(path.join(__dirname, 'public')));

// Configure the Passport middleware
var passport = passport();
app.use(Passport.initialize());
app.use(Passport.session());

// set router
var router = express.Router();
var index = require('./app/routes/index.server.route');
var admin = require('./app/routes/admin.server.route');
var chat = require('./app/routes/chat.server.route');
app.use('/_admin', admin);
app.use('/api/_admin', admin);
app.use('/chat', chat);
app.use('/api/chat', chat);
app.use('/', index);
app.use('/api/', index);


app.all('/chat/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.render('chat.jade', { root: './app/views',title:'chat',user:JSON.stringify(req.user)});
});

app.all('/_admin/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.render('admin.jade', { root: './app/views', title:'admin', user:JSON.stringify(req.user)});
});

app.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.render('index.jade', { root: './app/views',title:'test',user:JSON.stringify(req.user)});
});



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

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("client-sessions");
var mongoose = require("mongoose");

/* TODO Include route objects below */
//var index = require('./routes/index');
//var users = require('./routes/users');
//var shop = require("./routes/shop")

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var main_lobby = require("./routes/lobby");
var lobby = require('./sockets/lobby')(io);

var index = require('./routes/index');
var shop = require('./routes/shop');
var game = require('./routes/game')(io);
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({           // TODO : REMOVE DURING PRODUCTION!
  cookieName: "sess",
  secret: "aslkdjalskdjad",
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5,
  username: "Mega"
}));
app.use("/checkCookie",function(req,res,next)
{
  if (!req.SomeCookie.status)
  {
    console.log("Cookie not found, redirecting");
    console.log("app.use: "+req.SomeCookie);
    res.redirect("/users/setCookie/"); // NOTE: Disable this in production!
    //next();
  }
  else
  {
    console.log("cookie is already set!");
    res.redirect("/shop")
  }
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

/* TODO EDIT ROUTES TO ACTIVATE PATHS */
app.use('/', index);
app.use('/users', users);
app.use('/shop',shop);
app.use('/game', game);
app.use("/lobby/",main_lobby);

/*// cookie testing
app.use("/",session({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object 
  secret: 'blargadeeblargblarg', // should be a large unguessable string 
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds 
}));
 
app.use(function(req, res, next) {
  if (req.mySession.seenyou) {
    res.setHeader('X-Seen-You', 'true');
  } else {
    // setting a property will automatically cause a Set-Cookie response 
    // to be sent 
    req.mySession.seenyou = true;
    res.setHeader('X-Seen-You', 'false');
  }
});*/

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

/* DB Details, change when deploying */
var db_username = "";
var db_password = "";
var db_name = "mega-event";
var auth_connect_string = "mongodb://"+db_username+":"+db_password+"@localhost/"+db_name;
var connect_string = "mongodb://localhost/"+db_name;
mongoose.connect(connect_string);

module.exports = { app: app, server: server };

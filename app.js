var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var serverCheckout = require('./routes/server-checkout');
var braintreeCheckout = require('./routes/braintree-checkout');
var flavourCheckout = require('./routes/flavours-checkout');
var app = express();

// view engine setup
app.set('views', 
[path.join(__dirname, 'views'),
path.join(__dirname, 'views/client/'),
path.join(__dirname, 'views/server/'),
path.join(__dirname, 'views/braintree/')]);

app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get("/",function(req,res,next){
  res.render("index");
})

// client routes
app.get('/simpleClient', function(req,res){
  res.render("simple-client");
})

app.get('/confirmationClient', function(req,res){
  res.render("confirmation-client");
})

app.get('/experienceClient', function(req,res){
  res.render("experience-client");
})

app.get('/redirectionClient', function(req,res){
  res.render("redirection-client");
})

app.get('/markintegrationClient', function(req,res){
  res.render("markintegration-client");
})


app.get('/markflowClient', function(req,res){
  res.render("markflow-client");
})

// server routes

app.get('/simpleServer', function(req,res){
  res.render("simple-server");
})

app.get('/confirmationServer', function(req,res){
  res.render("confirmation-server");
})

app.get('/experienceServer', function(req,res){
  res.render("experience-server");
})

app.get('/redirectionServer', function(req,res){
  res.render("redirection-server");
})

app.get('/markintegrationServer', function(req,res){
  res.render("markintegration-server");
})

app.get('/fullredirectionServer', function(req,res){
  res.render("fullredirection-server");
})


app.get('/markflowServer', function(req,res){
  res.render("markflow-server");
});

// braintree routes
app.get('/simpleBrainTree', function(req,res){
  res.render("simple-braintree");
})

app.get('/redirectionBrainTree', function(req,res){
  res.render("redirection-braintree");
})

app.get('/experienceBrainTree', function(req,res){
  res.render("experience-braintree");
})

app.get('/confirmationBrainTree', function(req,res){
  res.render("confirmation-braintree");
})

app.get('/markintegrationBrainTree', function(req,res){
  res.render("markintegration-braintree");
})

app.get('/markflowBrainTree', function(req,res){
  res.render("markflow-braintree");
})

app.get("/cancel", function(req, res, next) {
  res.render("cancel");
});

app.get("/error", function(req, res, next) {
  res.render("error",{message:""});
});

app.use('/api/server', serverCheckout);

app.use('/api/braintree', braintreeCheckout);

app.use('/api/flavours',flavourCheckout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found'+ req.path);
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

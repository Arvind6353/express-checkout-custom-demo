var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');

var serverCheckout = require('./routes/server-checkout');
var braintreeCheckout = require('./routes/braintree-checkout');
var btdirectCheckout = require('./routes/btdirect');
var jsv3Checkout = require('./routes/jsv3-checkout');


var cors = require("cors");


var app = express();

//var socketImpl = require('./socketimpl')(app);

var allowCrossDomain = function(req, res, next) {
  //res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  next();
}


app.use(cors());
app.options('*', cors())
//app.use(allowCrossDomain)

 app.use(session({
   secret: 'ExpressCheckoutDemoPortal',
   name: 'checkoutKey',
   resave: true,
   saveUninitialized: true,
   cookie: {
     httpOnly: true
   }
 }));


// view engine setup
app.set('views', 
[path.join(__dirname, 'views'),
path.join(__dirname, 'views/client/'),
path.join(__dirname, 'views/server/'),
path.join(__dirname, 'views/braintree/'),
path.join(__dirname, 'views/btdirect/'),
path.join(__dirname, 'views/jsv3/')
]);

app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.get("/",function(req,res,next){
  res.render("portlets");
})

app.get("/indexjsv4",function(req,res,next){
  res.render("index-jsv4");
})


app.get("/indexjsv3",function(req,res,next){
  res.render("index-jsv3");
})

app.get("/indexecbt",function(req,res,next){
  res.render("index-ecbt");
})

app.get("/indexbtdirect",function(req,res,next){
  res.render("index-btdirect");
})

app.get("/indexclassic",function(req,res,next){
  res.render("index-classic");
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



// btdirect routes

app.get('/paypalBtdirect', function(req,res){
  res.render("paypal-btdirect");
})


app.get('/simpleDropinBtdirect', function(req,res){
  res.render("simple-dropin-btdirect");
})

app.get('/experienceDropinBtdirect', function(req,res){
  res.render("experience-dropin-btdirect");
})


app.get('/markflowDropinBtdirect', function(req,res){
  res.render("markflow-dropin-btdirect");
})

app.get('/simpleHostedFieldsBtdirect', function(req,res){
  res.render("simple-hostedfields-btdirect");
})

app.get('/experienceHostedFieldsBtdirect', function(req,res){
  res.render("experience-hostedfields-btdirect");
})


app.get('/markflowHostedFieldsBtdirect', function(req,res){
  res.render("markflow-hostedfields-btdirect");
})

// jsv3 routes

app.get("/simplejsv3", function(req, res, next) {
  res.render("simple-jsv3");
});

app.get("/experiencejsv3", function(req, res, next) {
  res.render("experience-jsv3");
});

app.get("/confirmationjsv3", function(req, res, next) {
  res.render("confirmation-jsv3");
});

app.get("/markflowjsv3", function(req, res, next) {
  res.render("markflow-jsv3");
});


app.get("/cancel", function(req, res, next) {
  res.render("cancel", {type:'jsv4'});
});

app.get("/error", function(req, res, next) {
  res.render("error",{message:"", type:'jsv4'});
});



app.use('/api/server', serverCheckout);
app.use('/api/braintree', braintreeCheckout);
app.use('/api/btdirect', btdirectCheckout);
app.use('/api/jsv3', jsv3Checkout);

// live chat bot api 
app.post('/webhook', function (req, res) {
  var data = req.body;
  if(req.body.object=='web') {
      request('http://localhost:9000/postback?data='+req.body.data, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        res.json(body);
      });
  }
});


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
  res.render('error', {type:'jsv4',message:'File not found '+ req.path});
});

module.exports = app;

var express = require("express");
var router = express.Router();
var braintree = require("braintree");

//var serverUrl = 'http://localhost:3000'
var serverUrl = 'https://expresscheckout-demo.herokuapp.com'

// cancel redirect
router.get("/cancel", function(req, res, next) {
    res.render("cancel",{type:'ecbt'});
});
  
router.get("/error", function(req, res, next) {
  res.render("error",{message:"",type:'ecbt'});
});

// get client token and send to the client 
router.get("/clienttoken", function(req,res,next){
  var gateway = braintree.connect({
    accessToken: req.query.btAccessToken || "access_token$sandbox$crbpxyv535v9r7z3$7d221657d8de0946cf08dedf124021a9"
  });
  gateway.clientToken.generate({}, function (err, response) {
    if(err){
      console.log("error in creating client token")
      res.render("error",{message:err,type:'ecbt'});
    return;
    }
    res.send(response.clientToken);
  });
})

// execute payment
router.post("/payment", function(req,res,next){
  var gateway = braintree.connect({
    accessToken: req.body.btAccessToken || "access_token$sandbox$crbpxyv535v9r7z3$7d221657d8de0946cf08dedf124021a9"
  });
  console.log("inside noonce")
  var saleRequest = {
    amount: "1.00",
    merchantAccountId: "USD",
    paymentMethodNonce: req.body.nonce
  };

  gateway.transaction.sale(saleRequest, function (err, result) {
    if (err) {
      res.json({"error": err});
    } else if (result.success) {
      res.json(result);
    } else {
      res.json({"error": result.message, type:'ecbt'});
    }
  });

})


// get payment details and render result
router.get('/getTrxDetails',function(req,res,next){
  var gateway = braintree.connect({
    accessToken: req.query.btAccessToken || "access_token$sandbox$crbpxyv535v9r7z3$7d221657d8de0946cf08dedf124021a9"
  });
  var paymentId = req.query.id;
  var stream = gateway.transaction.search(function (search) {
    search.id().is(paymentId);
  }, function (err, response) {
    if(err){
      console.log("errr",err);
      res.render("error",{message:err, type:'ecbt'});
    }
    response.each(function (err, transaction) {
      res.render("result_braintree",{res:transaction})
    });
    
  });
})

module.exports = router;

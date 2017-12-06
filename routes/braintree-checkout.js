var express = require("express");
var router = express.Router();
var braintree = require("braintree");
var gateway = braintree.connect({
  accessToken: "access_token$sandbox$jznnhy98qsk6t6sq$7f9895c1c7067cf9936d020f17585e6b"
});

var serverUrl = 'http://localhost:3000'

// cancel redirect
router.get("/cancel", function(req, res, next) {
    res.render("cancel");
});
  
router.get("/error", function(req, res, next) {
  res.render("error",{message:""});
});

router.get("/clienttoken",function(req,res,next){
  gateway.clientToken.generate({}, function (err, response) {
    if(err){
      console.log("error in creating client token")
      res.render("error",{message:err});
    }
    res.send(response.clientToken);
  });
})



router.post("/payment", function(req,res,next){
console.log("inside ononce")
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
    res.json({"error": result.message});
  }
});

})

module.exports = router;

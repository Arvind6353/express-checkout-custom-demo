var express = require("express");
var paypal = require("paypal-rest-sdk");
var router = express.Router();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AV2UJ4rXMH6vaJcJTUTJR4doweN1og37fTV6xTKIhEPqqmEU7ZuI_Kl86PeTm1EXf6CjdNEixjXmYM7v",
  client_secret:
    "EM1PKF6OWi3lonGwnuCeK8LAfqFr6Rpqbbo-98Ed9hMzNNWOJAvtEMb46m9jVvHjNHKc7kcribk31NrM"
});

var serverUrl = 'https://expresscheckout-demo.herokuapp.com'

var create_payment_json = {
  intent: "sale",
  payer: {
    payment_method: "paypal"
  },
  redirect_urls: {
    return_url: serverUrl+"/api/server/success",
    cancel_url: serverUrl+"/api/server/cancel"
  },
  transactions: [
    {
      amount:
      {
        total: "4.00",
        currency: "USD",
        details:
        {
          subtotal: "2.00",
          shipping: "1.00",
          tax: "2.00",
          shipping_discount: "-1.00"
        }
      },
      item_list:
      {
        items: [
        {
          quantity: "1",
          name: "item 1",
          price: "1",
          currency: "USD",
          description: "item 1 description",
          tax: "1"
        },
        {
          quantity: "1",
          name: "item 2",
          price: "1",
          currency: "USD",
          description: "item 2 description",
          tax: "1"
        }]
      },
      description: "The payment transaction description.",
      custom: "merchant custom data"
    }]
  
};

// create payment and return id
router.post("/payment", function(req, res, next) {
  var payload = create_payment_json; 
  if(req.body && req.body.intent =='sale'){
    payload = req.body;
  }
  paypal.payment.create(payload, function(
    err,
    result
  ) {
    if (err) {
      console.log('error in creating ',err);
      res.json({"error": err});
      return;      
    } else {
      console.log("Create Payment Response");
      res.json(result);
      return;
    }
  });
});

// execute payment
router.post("/payment-execute", function(req, res) {
  var paymentId = req.body.paymentID;
  var payerId = { payer_id: req.body.payerID };
  console.log("paymentId and payerId ",paymentId," and ",payerId)
  paypal.payment.execute(paymentId, payerId, function(error, payment) {
    if (error) {
      console.error('error in exectuing ',error);
      res.json({"error": error});
      return;
    } else {
      if (payment.state === "approved") {
        res.json(payment);
        return;
      } else {
        res.json({"error": "payment not successful"});
        return;
      }
    }
  });
});

// get payment details and return json
router.get('/payment',function(req,res,next){
  var paymentId = req.query.paymentId;
  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
      console.error('error ',error);
      res.json({"error": error});
      return;
    } else {
      if (payment.state === "approved" || payment.state === "created") {
        res.json(payment);
        return;
      } else {
        res.json({"error": "server error and payment state is "+payment.state});
        return;
      }
    }
  });
})

// get payment details and render result
router.get('/paymentDetails',function(req,res,next){
  var paymentId = req.query.paymentId;
  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
      console.error(error);
      res.render("error",{message:error});
    } else {
      if (payment.state === "approved") {
        res.render("result", {res:payment})
      } else {
        res.render("error",{message:"payment error"});
      }
    }
  });
})

// create payment and redirect to auth (full page redirect)
router.get("/redirectpayment", function(req, res, next) {
  var payload = create_payment_json; 
  paypal.payment.create(payload, function(
    err,
    result
  ) {
    if (err) {
      res.render("error",{message : err});
    } else {
      console.log("Create Payment Response");
      //you forgot to redirect your response to paypal sandbox
      var redirectUrl;
      for (var i = 0; i < result.links.length; i++) {
        var link = result.links[i];
        if (link.method === "REDIRECT") {
          redirectUrl = link.href;
        }
      }
      res.redirect(redirectUrl);
    }
  });
});

// handle auth redirect on full page
router.get("/success", function(req, res) {
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, function(error, payment) {
    if (error) {
      console.error(error);
      res.send("payment error");
    } else {
      if (payment.state === "approved") {
        res.render("result", {res:payment})
      } else {
        res.send("payment not successful");
      }
    }
  });
});

// cancel redirect
router.get("/cancel", function(req, res, next) {
    res.render("cancel");
});
  
router.get("/error", function(req, res, next) {
  res.render("error",{message:""});
});
  

module.exports = router;

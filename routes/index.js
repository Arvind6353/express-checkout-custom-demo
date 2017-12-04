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
    return_url: serverUrl+"/api/success",
    cancel_url: serverUrl+"/api/cancel"
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

router.all("/payment", function(req, res, next) {
  paypal.payment.create(create_payment_json, function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
    } else {
      console.log("Create Payment Response");
      console.log(result);
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

router.get("/success", function(req, res) {
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, function(error, payment) {
    if (error) {
      console.error(error);
      res.render("error",{message:"payment error"});      
    } else {
      if (payment.state === "approved") {
        res.render("result", {res:payment})
      } else {
        res.render("error",{message:"payment error"});      
      }
    }
  });
});

router.get("/cancel", function(req, res, next) {
  res.render("cancel");
});

router.get("/error", function(req, res, next) {
  res.render("error",{message:""});
});

router.get('/paymentDetails',function(req,res,next){
  var paymentId = req.query.paymentId;
  paypal.payment.get(paymentId, function (error, payment) {
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
})

module.exports = router;

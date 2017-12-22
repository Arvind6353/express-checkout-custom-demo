var express = require("express");
var paypal = require("paypal-rest-sdk");
var router = express.Router();

var serverUrl = 'https://expresscheckout-demo.herokuapp.com'

paypal.configure({
  mode:  "sandbox", //sandbox or live
  client_id: "AV2UJ4rXMH6vaJcJTUTJR4doweN1og37fTV6xTKIhEPqqmEU7ZuI_Kl86PeTm1EXf6CjdNEixjXmYM7v",
  client_secret: "EM1PKF6OWi3lonGwnuCeK8LAfqFr6Rpqbbo-98Ed9hMzNNWOJAvtEMb46m9jVvHjNHKc7kcribk31NrM"
 });

var create_payment_json = {
  intent: "sale",
  payer: {
    payment_method: "paypal"
  },
  redirect_urls: {
    return_url: serverUrl+"/api/jsv3/success",
    cancel_url: serverUrl+"/api/jsv3/cancel"
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


// create payment and redirect to paypal auth page
router.post("/payment", function(req, res, next) {
  var payload = create_payment_json; 

  console.log('request body ' ,req.body);

  paypal.configure({
    mode: req.body.mode || "sandbox", //sandbox or live
    client_id: req.body.clientId || "AV2UJ4rXMH6vaJcJTUTJR4doweN1og37fTV6xTKIhEPqqmEU7ZuI_Kl86PeTm1EXf6CjdNEixjXmYM7v",
    client_secret: req.body.clientSecret || "EM1PKF6OWi3lonGwnuCeK8LAfqFr6Rpqbbo-98Ed9hMzNNWOJAvtEMb46m9jVvHjNHKc7kcribk31NrM"
   });

   req.session.paypal = paypal;
   
  paypal.payment.create(payload, function(
    err,
    result
  ) {
    if (err) {
      res.render("error",{message : err, type:'jsv3'});
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



// get payment details and return json
router.get('/payment',function(req,res,next){
  var paymentId = req.query.paymentId;

  paypal.configure(req.session.paypal.configuration);

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

// handle auth redirect on full page
router.get("/success", function(req, res) {
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };

  paypal.configure(req.session.paypal.configuration);

  paypal.payment.execute(paymentId, payerId, function(error, payment) {
    if (error) {
      console.log('error',error);
      res.render("error",{message:error ,type:'jsv3'});
    } else {
      if (payment.state === "approved") {
        res.render("result", {res:payment, type:'jsv3'})
      } else {
        res.render("error",{message:"payment error", type:'jsv3'});      
      }
    }
  });
});

// cancel redirect
router.get("/cancel", function(req, res, next) {
    res.render("cancel", {type:'jsv3'});
});
  
router.get("/error", function(req, res, next) {
  res.render("error",{message:"", type:'jsv3'});
});
  

router.post('/experience-jsv3', function(req,res,next){

  paypal.configure({
    mode: req.body.mode || "sandbox", //sandbox or live
    client_id: req.body.clientId || "AV2UJ4rXMH6vaJcJTUTJR4doweN1og37fTV6xTKIhEPqqmEU7ZuI_Kl86PeTm1EXf6CjdNEixjXmYM7v",
    client_secret: req.body.clientSecret || "EM1PKF6OWi3lonGwnuCeK8LAfqFr6Rpqbbo-98Ed9hMzNNWOJAvtEMb46m9jVvHjNHKc7kcribk31NrM"
   });

   req.session.paypal = paypal;

  var profile_name = Math.random().toString(36).substring(7);
  
  var create_web_profile_json = {
      "name": profile_name,
      "presentation": {
          "brand_name": "Best Brand",
          "logo_image": "https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_mc_vs_dc_ae.jpg",
          "locale_code": "US"
      },
      "input_fields": {
          "allow_note": true,
          "no_shipping": 1,
          "address_override": 1
      },
      "flow_config": {
          "landing_page_type": "billing",
          "bank_txn_pending_url": "http://www.yeowza.com"
      }
  };
  
  paypal.webProfile.create(create_web_profile_json, function (error, web_profile) {
      if (error) {
          res.render("error",{message : error, type:'jsv3'});  
    } else {
          console.log("Create web_profile Response");
         // console.log(web_profile);
          var payload = create_payment_json;
          payload.experience_profile_id = web_profile.id;

          paypal.payment.create(payload, function(
            err,
            result
          ) {
            if (err) {
              res.render("error",{message : err, type:'jsv3'});
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
      }
  });
})


module.exports = router;

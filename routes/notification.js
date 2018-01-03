var express = require("express");

var paypal = require("paypal-rest-sdk");

var router = express.Router();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AT1xNSxWsMQ6ppJOBjtPu3plaHf3b55omrjDFAZOMPFHv_OUtFYI8k6hOT9QhE7Jnkz97KbnaiUf0hDx",
  client_secret:
    "EFaMlJ0-s-lZT9UGa7eoHWSFZwiN6ZdtUlTtHb_-32fE1fjOnFgXMscquhCxrOrbrPEVoQDP9mZ7Pdfl"
});



var create_webhook_json = {
  "url": "https://expresscheckout-demo.herokuapp.com/api/notification",
  "event_types": [
      {
          "name": "PAYMENT.AUTHORIZATION.CREATED"
      },
      {
          "name": "PAYMENT.AUTHORIZATION.VOIDED"
      }
  ]
};

router.get('/',function(req,res,next){
  paypal.notification.webhook.create(create_webhook_json, function (error, webhook) {
  if (error) {
      console.log(error.response);
      throw error;
  } else {
      console.log("Create webhook Response");
      console.log(webhook);
  }
});
});

router.post('/',function(req,res,next){
  
  console.log('req is ', req.body);
  res.end();
})

module.exports = router;

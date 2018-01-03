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
  
  console.log('req is ', req.body)
})

module.exports = router;

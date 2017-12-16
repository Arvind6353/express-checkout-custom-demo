var express = require("express");
var router = express.Router();
var braintree = require('braintree');

router.post('/payment', function(req, res, next) {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: 'cy72x4r2x9qmwy2b',
    publicKey: 'p7v3dp77dgy3yrsh',
    privateKey: '7f34de1549528c62a5acd6c20cdd23a3'
  });

  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  console.log(nonceFromTheClient)
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: '4.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});


router.get('/clienttoken', function (req, res) {

  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: 'cy72x4r2x9qmwy2b',
    publicKey: 'p7v3dp77dgy3yrsh',
    privateKey: '7f34de1549528c62a5acd6c20cdd23a3'
  });
  gateway.clientToken.generate({}, function (err, response) {
    if(err) {
      console.error(err);
      res.send(err);
    return;
    }
    console.log(" sending btdirect token");
    res.send(response.clientToken);
  });
});



module.exports = router;

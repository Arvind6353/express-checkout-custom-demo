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

var serverUrl = 'http://localhost:3000'

var url = require('url');

var isoDate = new Date();
isoDate.setSeconds(isoDate.getSeconds() + 4);
isoDate.setMinutes(isoDate.getMinutes()+50);
isoDate.toISOString().slice(0, 19) + 'Z';

var billingPlanAttributes = {
    "description": "Create Plan for Regular",
    "merchant_preferences": {
        "auto_bill_amount": "yes",
        "cancel_url": "http://localhost:3000/api/flavours/cancel",
        "initial_fail_amount_action": "continue",
        "max_fail_attempts": "1",
        "return_url": "http://localhost:3000/api/flavours/success",
        "setup_fee": {
            "currency": "USD",
            "value": "25"
        }
    },
    "name": "Testing1-Regular1",
    "payment_definitions": [
        {
            "amount": {
                "currency": "USD",
                "value": "100"
            },
            "charge_models": [
                {
                    "amount": {
                        "currency": "USD",
                        "value": "10.60"
                    },
                    "type": "SHIPPING"
                },
                {
                    "amount": {
                        "currency": "USD",
                        "value": "20"
                    },
                    "type": "TAX"
                }
            ],
            "cycles": "0",
            "frequency": "MONTH",
            "frequency_interval": "1",
            "name": "Regular 1",
            "type": "REGULAR"
        },
        {
            "amount": {
                "currency": "USD",
                "value": "20"
            },
            "charge_models": [
                {
                    "amount": {
                        "currency": "USD",
                        "value": "10.60"
                    },
                    "type": "SHIPPING"
                },
                {
                    "amount": {
                        "currency": "USD",
                        "value": "20"
                    },
                    "type": "TAX"
                }
            ],
            "cycles": "4",
            "frequency": "MONTH",
            "frequency_interval": "1",
            "name": "Trial 1",
            "type": "TRIAL"
        }
    ],
    "type": "INFINITE"
};

var billingPlanUpdateAttributes = [
    {
        "op": "replace",
        "path": "/",
        "value": {
            "state": "ACTIVE"
        }
    }
];



// var isoDate1 = new Date();
// isoDate1.setSeconds(isoDate.getSeconds() + 4);
// isoDate1.setMinutes(isoDate.getMinutes()+50);
// isoDate1.setHours(isoDate.getHours()+5);
// isoDate1.setYear(isoDate)

// isoDate1.toISOString().slice(0, 19) + 'Z';

var d= "2019-12-22T09:13:49Z"

var billingAgreementAttributes = {
    "name": "Test Speed Agreement",
    "description": "Agreement for Fast Speed Plan",
    "start_date":  d,
    "plan": {
        "id": "P-0NJ10521L3680291SOAQIVTQ"
    },
    "payer": {
        "payment_method": "paypal"
    },
    "shipping_address": {
        "line1": "StayBr111idge Suites",
        "line2": "Cro12ok Street",
        "city": "San Jose",
        "state": "CA",
        "postal_code": "95112",
        "country_code": "US"
    }
};




















// create payment and return id
router.get("/payment", function(req, res, next) {
  
    // Create the billing plan
paypal.billingPlan.create(billingPlanAttributes, function (error, billingPlan) {
    if (error) {
        console.log(error);
        throw error;
    } else {
        console.log("Create Billing Plan Response");
        //console.log(billingPlan);

        // Activate the plan by changing status to Active
        paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log("Billing Plan state changed tosss  " + billingPlan.state);
                billingAgreementAttributes.plan.id = billingPlan.id;

                // Use activated billing plan to create agreement
                paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
                    if (error) {
                        //console.dir(error)
                        console.log(error.Error)
                        console.log(error.response);
                        //throw error;
                    } else {
                        console.log("Create Billing Agreement Response");
                        console.log(billingAgreement);
                        for (var index = 0; index < billingAgreement.links.length; index++) {
                            if (billingAgreement.links[index].rel === 'approval_url') {
                                var approval_url = billingAgreement.links[index].href;
                                console.log("For approving subscription via Paypal, first redirect user to");
                                console.log(approval_url);
                                res.redirect(approval_url);

                                console.log("Payment token is");
                                console.log(url.parse(approval_url, true).query.token);
                                // See billing_agreements/execute.js to see example for executing agreement 
                                // after you have payment token
                            }
                        }
                    }
                });
            }
        });
    }
});





});




// cancel redirect
router.get("/cancel", function(req, res, next) {
    res.render("cancel");
});
  


// cancel redirect
router.get("/success", function(req, res, next) {

    console.log('incoming succes',req.query.token);

    paypal.billingAgreement.execute(req.query.token, {}, function (error, billingAgreement) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            console.log("Billing Agreement Execute Response");
            console.log(JSON.stringify(billingAgreement));
            res.json(billingAgreement);
        }
    });


//    res.end(req.query.token);

});

router.get("/error", function(req, res, next) {
  res.render("error",{message:""});
});
  

module.exports = router;

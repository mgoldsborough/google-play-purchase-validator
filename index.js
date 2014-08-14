var request = require('google-oauth-jwt').requestWithJWT();
var util = require('util');

module.exports = Verifier;
function Verifier(options) {
  this.options = options || {};
}

Verifier.prototype.verify = function(receipt, cb) {
  var urlPattern = "https://www.googleapis.com/androidpublisher/v2/applications/%s/purchases/subscriptions/%s/tokens/%s";
  var finalUrl = util.format(urlPattern, receipt.packageName, receipt.productId, receipt.purchaseToken);
  request({
    url: finalUrl,
    jwt: {
      email: this.options.email,
      key: this.options.key,
      keyFile: undefined,
      scopes: ['https://www.googleapis.com/auth/androidpublisher']
    }
  }, function (err, res, body) {
    if (err) {
      cb(err);
    }
    var obj = JSON.parse(body);
    if ("error" in obj) {
      cb(new Error(obj.error.message));
    } else if ("expiryTimeMillis" in obj && "startTimeMillis" in obj) {
      cb(null, obj);
    } else {
      cb(new Error("body did not contain expected json object"));
    }
  });
};

/* example code */
var Verifier = require('google-play-purchase-validator');
var options = {
  email: 'gmailservice@accountemail',
  key: '-----BEGIN PRIVATE KEY-----your private key-----END PRIVATE KEY-----',
  keyFile: 'alternatively path to key file'
};
var verifier = new Verifier(options);
var receipt = {
  packageName: "de.example.com",
  productId: "subscription",
  purchaseToken: "PURCHASE_TOKEN_RECEIVED_BY_THE_USERS_DEVICE_AFTER_PURCHASE"
};
verifier.verify(receipt, function cb(err, response) {
  if (err) {
    console.log("there was an error validating the receipt");
    console.log(err);
  }
  console.log("sucessfully validated the receipt");
  /* response looks like this
  {
  "kind": "androidpublisher#subscriptionPurchase",
  "startTimeMillis": long,
  "expiryTimeMillis": long,
  "autoRenewing": boolean
  }*/
  console.log(response);
});
/* end example code */

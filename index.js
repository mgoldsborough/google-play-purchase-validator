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


var options = {
  email: '315235187086-uh1j98me4blsvhl2vcf6k7oa66924tpv@developer.gserviceaccount.com',
  key: '-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAOI4DI9UVBDyLC43\nrjMnaCvC29xJtX8Z/4/j8FM3aPnNWA9F+bKCdtMeQaWMeY8fnKv0XARbrJ6WUwW6\nPHBzpJxfTcEWI1uZ5PjCDOq6aMqUn2EcqMfECNl0g2tsgK7iLgw7pRboupU9DS4B\nAP7Q2n2HPdgZQDY0V/8FNTMfVQ51AgMBAAECgYBJEhO0hGe3JZJxx1iEe3khkYqV\nCFYQ3SP4pYbuSlqlPdfw7whtych5/y7zO4HUYkCoJoFGgxoqC6J7miGFrUUBBiop\nV7TDcgpkyahP+/9glAoPV+uYuInqzv0vde+mf6ky2EjbyFcgxRsJJPBWhqaeOFV/\nATMLK02L99gWd6uZ7QJBAPNJ7+SI0sdV3tEGUNUnWcGsaEgvqMZN9mXTXCKQZS3u\noUs/j50e25CrxjtyvnwjGzOxBEfgsWVk33/foxMq6y8CQQDuCcwRX8WhFnx87icz\nRrsFx/CedCe1ataQ96VQpiO3Oe70RR43LAT8mMPJ8I0Jtn2iH227K2SQWMyRtHEa\no6ebAkEAn/uG3Ol8ccht9VYJ4aE2zLzq9k0g1wZ9eQg8Fh6N6l55gloRvmiESeYr\nPPx/dnI/eQZ2oi2Hef2TWytcuUYH0QJAY/S5PJJ66qoGnG9lBqMs5cCPyfn8srGq\naDWVtcgON2KcdPaROZnCfk+n56SblPiMyQdpjK8sC3E+dfDPjeArAQJADToTzKlt\nHu6Ps0QCDnoQXh1DEE8Zc76vXxX/4HZ2fmOIohVprWYGzdaesH7csaIJqpmkxkSy\n7eyq6TuAzNrh2Q\u003d\u003d\n-----END PRIVATE KEY-----',
};
var verifier = new Verifier(options);
var jsonString = "{\"orderId\":\"12999763169054705758.1335272522351620\",\"packageName\":\"de.prosiebensat1digital.seventv\",\"productId\":\"7tv_livetv_subscription\",\"purchaseTime\":1405620944948,\"purchaseState\":0,\"developerPayload\":\"{\\\"payload_user_id_base64\\\":\\\"OTE3NzU1NjAxMjI0MzA5MTQ1Ng==\\\"}\",\"purchaseToken\":\"lefhjjgnjemdacdkhchggjei.AO-J1OxS7E7Cg17kQzu6ingt7pzLrHDh02OoBVOzn28kg027Sh7JB6x1peWhOWowkXuE2-YlbGRVHeI5SZ87KzTQTPdJ8BiBW7yEA-bkpz-eC6-IOSTf6CQfmhVKcmku9I644rv8RexPj3yhpnvK-E1G8bR0qCOWXw\"}";
var receipt = JSON.parse(jsonString);
verifier.verify(receipt, function cb(err, body) {
  console.log(err);
  console.log(body);
});

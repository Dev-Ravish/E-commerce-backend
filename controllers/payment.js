const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'w5h3jyczksdq7w3x',
  publicKey: 'f5j23mh5z7ztkxk5',
  privateKey: 'c8e4dfef3815b5ef4e56ca058f817965',
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      return response.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  console.log('HAKjnN');
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amount = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amount,
      paymentMethodNonce: nonceFromTheClient,
      // deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, response) => {
      if (err) {
        return response.status(500).json(err);
      } else {
        res.send(response);
      }
    }
  );
};

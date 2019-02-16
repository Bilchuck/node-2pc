const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const config = require('./config.json');


app.post('/pay_and_ship', async (req, res) => {
  const shipData = req.body.shipping;
  const paymentData = req.body.payment;

  const preparePromises = [
    prepare(config.PAYMENT_PORT, 'payment', paymentData),
    prepare(config.SHIPPING_PORT, 'shipping', shipData),
  ];
  let payResult, shipResult;
  try {
    [payResult, shipResult] = await Promise.all(preparePromises);
    console.log('ALL PREPARED')
  } catch (error) {
    console.error(error);
    const abortPromises = [
      abort(config.PAYMENT_PORT, 'payment', payResult.id),
      abort(config.SHIPPING_PORT, 'shipping', shipResult.id),
    ];
    await Promise.all(abortPromises);
    res.send({ success: false });
  }

  if (payResult.success !== true || shipResult.success !== true) {
    const abortPromises = [
      abort(config.PAYMENT_PORT, 'payment', payResult.id),
      abort(config.SHIPPING_PORT, 'shipping', shipResult.id),
    ];
    await Promise.all(abortPromises);
    res.send({ success: false })
  } else {
    const commitPromises = [
      commit(config.PAYMENT_PORT, 'payment', payResult.id),
      commit(config.SHIPPING_PORT, 'shipping', shipResult.id),
    ];
    await Promise.all(commitPromises);
    res.send({ success: true });
  }
});

const prepare = (port, url, data) => {
  return axios.post(`http://localhost:${port}/${url}/prepare`, data)
    .then(result => result.data);
}
const commit = (port, url, id) => {
  return axios.post(`http://localhost:${port}/${url}/commit`, { id })
    .then(result => result.data);
}
const abort = (port, url, id) => {
  return axios.post(`http://localhost:${port}/${url}/abort`, { id })
    .then(result => result.data);
}

app.listen(config.GATEWAY_PORT, () => {
  console.log(`Gateway started on ${config.GATEWAY_PORT} port.`)
})



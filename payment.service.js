const express = require('express');
const Sequelize = require('sequelize');
const config = require('./config.json');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const sequelize = new Sequelize({
  ...config.PAYMENT_DB,
  host: process.env.DB_HOST,
});

const start = async () => {
  await sequelize.sync();
  const transactions = {

  };
  // prepare
  app.post('/payment/prepare', async (req, res) => {
    try {
      console.log('New prepare payment request.');
      const paymentData = req.body;
      const transaction = await sequelize.transaction({ autocommit: false });

      await sequelize.query(`
        INSERT INTO payments (amount, user_name) VALUES
        (${paymentData.amount}, '${paymentData.user_name}')
      `, { transaction });

      transactions[transaction.id] = transaction;
      res.send({ success: true, id: transaction.id });
    } catch (error) {
      console.error(error);
      res.send({ success: false, error });
    }
  });
  // commit
  app.post('/payment/commit', async (req, res) => {
    const transactionId = req.body.id;
    console.log(`Commit ${transactionId} transaction`);
    if (!transactions[transactionId]) {
      res.send({ success: false });
    } else {
      await transactions[transactionId].commit();
      delete transactions[transactionId];
      res.send({ success: true });
    }
  });
  // abort
  app.post('/payment/abort', async (req, res) => {
    const transactionId = req.body.id;
    console.log(`abort ${transactionId} transaction`);
    if (transactions[transactionId]) {
      await transactions[transactionId].rollback();
      delete transactions[transactionId];
    }
    res.send({ success: true });
  });
  


  app.listen(config.PAYMENT_PORT, () => {
    console.log(`Payment service started! Listening ${config.PAYMENT_PORT} port.`);
  });
}

start();



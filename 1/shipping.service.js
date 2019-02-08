const express = require('express');
const Sequelize = require('sequelize');
const config = require('./config.json');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const sequelize = new Sequelize(config.SHIPPING_DB);

const start = async () => {
  await sequelize.sync();
  const transactions = {

  };
  // prepare
  app.post('/shipping/prepare', async (req, res) => {
    try {
      console.log('New prepare shipping request.');
      const shippingData = req.body;
      const transaction = await sequelize.transaction({ autocommit: false });

      await sequelize.query(`
        INSERT INTO shippings (price, item_name) VALUES
        (${shippingData.price}, '${shippingData.item_name}')
      `, { transaction });

      transactions[transaction.id] = transaction;
      res.send({ success: true, id: transaction.id });
    } catch (error) {
      res.send({ success: false, error });
    }
  });
  // commit
  app.post('/shipping/commit', async (req, res) => {
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
  app.post('/shipping/abort', async (req, res) => {
    const transactionId = req.body.id;
    console.log(`abort ${transactionId} transaction`);
    if (transactions[transactionId]) {
      await transactions[transactionId].rollback();
      delete transactions[transactionId];
    }
    res.send({ success: true });
  });
  


  app.listen(config.SHIPPING_PORT, () => {
    console.log(`Shipping service started! Listening ${config.SHIPPING_PORT} port.`);
  });
}

start();



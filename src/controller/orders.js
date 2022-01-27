const Order = require('../models/orders.js');

const newOrden = async (req, res) => {
  const { userId, client } = req.body;
  const newOrder = new Order({
    userId,
    client,
    // products,

  });
  await newOrder.save();
  res.json('order recibida');
};

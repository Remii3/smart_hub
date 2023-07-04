const Order = require('../Models/order');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: 'Failed fetching orders',
      err,
    });
  }
};

const addOrder = async (req, res) => {
  try {
    const { buyerId, products } = req.body;

    const order = new Order({ buyer: buyerId, items: products });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed adding new order', err });
  }
};

module.exports = { getOrders, addOrder };

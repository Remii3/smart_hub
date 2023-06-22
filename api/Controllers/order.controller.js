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
    const { user, items } = req.body;
    const totalAmount = 0;

    const order = new Order({ user, items, totalAmount });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed adding new order', err });
  }
};

module.exports = { getOrders, addOrder };

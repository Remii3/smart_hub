const { default: mongoose } = require('mongoose');
const Order = require('../Models/order');
const Product = require('../Models/product');
const User = require('../Models/user');

const getOrders = async (req, res) => {
  const { userId } = req.body;
  try {
    const orders = await Order.find({ buyerId: userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: 'Failed fetching orders',
    });
  }
};

const getOneOrder = async (req, res) => {
  const { userId, orderId } = req.body;
  try {
    const order = await Order.find({ buyerId: userId, _id: orderId });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      message: 'Failed fetching orders',
    });
  }
};

const addOrder = async (req, res) => {
  try {
    const { buyerId, items } = req.body;

    const orderId = new mongoose.Types.ObjectId();
    await Order.create({
      _id: orderId,
      buyer_id: buyerId,
      products: items,
    });
    await User.updateOne({ _id: buyerId }, { $push: { orders: orderId } });
    for (const item of items) {
      const quantityAfterBuy = item.productData.quantity - item.inCartQuantity;
      if (quantityAfterBuy <= 0) {
        await Product.updateOne(
          { _id: item.productData._id },
          {
            $set: {
              quantity: quantityAfterBuy,
              sold: true,
            },
          },
        );
      } else {
        await Product.updateOne(
          { _id: item.productData._id },
          {
            $set: {
              quantity: quantityAfterBuy,
            },
          },
        );
      }
    }

    res.status(201).json({ message: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed adding new order', err });
  }
};

module.exports = { getOrders, addOrder, getOneOrder };

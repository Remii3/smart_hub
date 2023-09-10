const { default: mongoose } = require('mongoose');
const Order = require('../Models/order');
const Product = require('../Models/product');
const User = require('../Models/user');

const allOrders = async (req, res) => {
  const { userId } = req.body;
  try {
    const orders = await Order.find({ buyerId: userId }).populate(
      'products.product',
    );
    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed fetching orders',
    });
  }
};

const oneOrder = async (req, res) => {
  const { userId, orderId } = req.query;
  try {
    const order = await Order.findOne({
      buyer_id: userId,
      _id: orderId,
    }).populate('products.product');
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
    const mappedItems = items.map(item => {
      return {
        product: item.productData,
        in_cart_quantity: item.inCartQuantity,
        total_price: item.totalPrice,
      };
    });
    console.log(mappedItems);
    const test = await Order.create({
      _id: orderId,
      buyer_id: buyerId,
      products: mappedItems,
    });
    console.log(test);
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

module.exports = { allOrders, oneOrder, addOrder };

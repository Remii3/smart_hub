const { default: mongoose } = require('mongoose');
const Order = require('../Models/order');
const Product = require('../Models/product');
const User = require('../Models/user');

const getAllOrders = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(422).json({ message: 'Provide user id' });
  }

  try {
    const orders = await Order.find({ buyerId: userId }).populate(
      'products.product',
    );
    return res.status(200).json({ data: orders });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed fetching orders',
      error: err.message,
    });
  }
};

const getOneOrder = async (req, res) => {
  const { userId, orderId } = req.query;

  if (!userId) {
    return res.status(422).json({ message: 'Provide user id' });
  }

  if (!orderId) {
    return res.status(422).json({ message: 'Provide order id' });
  }

  try {
    const order = await Order.findOne({
      buyerId: userId,
      _id: orderId,
    }).populate('products.product');

    return res.status(200).json({ data: order });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed fetching orders',
      error: err.message,
    });
  }
};

const addOneOrder = async (req, res) => {
  const { buyerId, items } = req.body;
  if (!buyerId) {
    return res.status(422).json({ message: 'Provide buyer id' });
  }
  try {
    const orderId = new mongoose.Types.ObjectId();
    const mappedItems = items.map(item => {
      return {
        product: item.productData,
        inCartQuantity: item.inCartQuantity,
        totalPrice: item.totalPrice,
      };
    });
    await Order.create({
      _id: orderId,
      buyerId: buyerId,
      products: mappedItems,
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

    return res.status(201).json({ message: 'Success', data: { _id: orderId } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed adding new order', error: err.message });
  }
};

module.exports = { getAllOrders, getOneOrder, addOneOrder };

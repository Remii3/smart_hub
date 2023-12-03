const { default: mongoose } = require('mongoose');
const Order = require('../Models/order');
const Product = require('../Models/product');
const reverseCashFormatter = require('../helpers/reverseCashFormatter');
const cashFormatter = require('../helpers/cashFormatter');

const prepareData = originalData => {
  if (Array.isArray(originalData)) {
    const preparedData = [...originalData];

    for (let i = 0; i < originalData.length; i++) {
      preparedData[i].orderPrice = `${cashFormatter({
        number: preparedData[i].orderPrice,
      })}`;
    }
    return preparedData;
  } else {
    const preparedData = { ...originalData };

    preparedData.orderPrice = `${cashFormatter({
      number: preparedData.orderPrice,
    })}`;
    return preparedData;
  }
};

const getAllOrders = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(422).json({ message: 'Provide user id' });
  }

  try {
    const orders = await Order.find({ buyerId: userId }).populate(
      'products.product',
    );

    const preparedData = prepareData(orders);
    return res.status(200).json({ data: preparedData });
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
    let orderPrice = 0;
    const mappedItems = items.map(item => {
      orderPrice += Number(reverseCashFormatter({ number: item.totalPrice }));
      return {
        product: item.productData._id,
        inCartQuantity: item.inCartQuantity,
        totalPrice: reverseCashFormatter({ number: item.totalPrice }),
      };
    });

    await Order.create({
      _id: orderId,
      buyerId: buyerId,
      products: mappedItems,
      status: 'Paid',
      orderPrice,
    });

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
const getSearchOrder = async (req, res) => {
  let { pageSize, filtersData, withPagination } = req.query;
  const rawData = {};
  try {
    const searchQuery = {};
    if (!filtersData) {
      filtersData = { page: 1 };
    }

    let currentPage = filtersData.page;

    if (!currentPage) {
      currentPage = 1;
    }

    let currentPageSize = pageSize;
    if (!currentPageSize) {
      currentPageSize = 10;
    }

    const skipPages = (currentPage - 1) * currentPageSize;

    if (filtersData.query) {
      searchQuery._id = filtersData.query;
    }

    const data = await Order.find(searchQuery).limit(pageSize).skip(skipPages);

    if (withPagination) {
      const totalDocuments = await Order.find(searchQuery).countDocuments();
      const totalPages = Math.ceil(totalDocuments / currentPageSize);
      rawData.totalPages = totalPages;
      rawData.totalOrders = totalDocuments;
    }
    const preparedData = prepareData(data);

    return res.json({ data: { data: preparedData, rawData } });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      message: 'We failed searching for your orders.',
    });
  }
};
const deleteOneOrder = async (req, res) => {
  const { userId, orderId } = req.body;
  try {
    await Order.deleteOne({ buyerId: userId, _id: orderId });
    return res.json({ message: 'Successfully removed order.' });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      message: 'We failed removing your order.',
    });
  }
};
const deleteAllOrders = async (req, res) => {
  const { userId } = req.body;
  try {
    await Order.deleteMany({ buyerId: userId });
    return res.json({ message: 'Successfully removed all of your orders.' });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      message: 'We failed removing all of your orders.',
    });
  }
};
module.exports = {
  getAllOrders,
  getOneOrder,
  addOneOrder,
  deleteOneOrder,
  deleteAllOrders,
  getSearchOrder,
};

const { default: mongoose } = require('mongoose');
const { Product } = require('../Models/product');
const Comment = require('../Models/comment');
const Order = require('../Models/order');

const calculateFutureDeleteDate = require('../helpers/calculate/calculateFutureDeleteDate');
const cashFormatter = require('../helpers/cashFormatter');

const getHighestPrice = async ({ pipeline, rawData, limit }) => {
  const highestPrice = await Product.aggregate(pipeline).limit(Number(limit));
  rawData.highestPrice =
    highestPrice.length > 0
      ? cashFormatter({ number: highestPrice[0].maxNumber })
      : cashFormatter({ number: 0 });
  return highestPrice;
};

const prepareData = originalData => {
  if (Array.isArray(originalData)) {
    const preparedData = [...originalData];

    for (let i = 0; i < originalData.length; i++) {
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }
    return preparedData;
  } else {
    const preparedData = { ...originalData };

    preparedData.price = {
      ...preparedData.price,
      value: `${cashFormatter({
        number: preparedData.price.value,
      })}`,
    };
    return preparedData;
  }
};

const getAllProducts = async (req, res) => {
  const { limit = 10, withHighPrice } = req.query;
  const rawData = {};
  const query = req.queryData;
  const sortMethod = req.sortMethod;
  try {
    const productsData = await Product.find({
      ...query,
    })
      .sort(sortMethod)
      .populate(['authors', 'categories'])
      .limit(Number(limit))
      .lean();

    const preparedData = prepareData(productsData);

    if (withHighPrice) {
      const pipeline = [];

      pipeline.push({
        $match: {
          ...query,
        },
      });

      pipeline.push({
        $group: {
          _id: null,
          maxNumber: { $max: '$price.value' },
        },
      });

      await getHighestPrice({ pipeline, rawData, limit });
    }
    return res.status(200).json({ data: { data: preparedData, rawData } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'We failed fetching products.', error: err.message });
  }
};

const getShopProducts = async (req, res) => {
  const { limit = 10, withHighPrice } = req.query;
  const sortMethod = req.sortMethod;
  const rawData = {};
  const query = req.queryData;

  try {
    const productsData = await Product.find({
      ...query,
    })
      .sort(sortMethod)
      .populate(['authors', 'categories'])
      .limit(limit)
      .lean();

    const preparedData = prepareData(productsData);
    if (withHighPrice) {
      const pipeline = [];
      pipeline.push({
        $match: {
          ...query,
        },
      });
      pipeline.push({
        $group: {
          _id: null,
          maxNumber: { $max: '$price.value' },
        },
      });
      await getHighestPrice({ pipeline, rawData, limit });
    }

    return res.status(200).json({ data: { data: preparedData, rawData } });
  } catch (err) {
    return res.status(500).json({
      message: 'We failed fetching shop products.',
      error: err.message,
    });
  }
};

const getCollectionProducts = async (req, res) => {
  const { limit = 10, withHighPrice } = req.query;
  const sortMethod = req.sortMethod;
  const rawData = {};
  const query = req.queryData;

  try {
    const productsData = await Product.find({
      ...query,
    })
      .sort(sortMethod)
      .populate(['authors', 'categories'])
      .limit(limit)
      .lean();

    const preparedData = prepareData(productsData);

    if (withHighPrice) {
      const pipeline = [];
      pipeline.push({
        $match: {
          ...query,
        },
      });
      pipeline.push({
        $group: {
          _id: null,
          maxNumber: { $max: '$price.value' },
        },
      });
      await getHighestPrice({ pipeline, rawData, limit });
    }

    return res.status(200).json({ data: { data: preparedData, rawData } });
  } catch (err) {
    return res.status(500).json({
      message: 'Fetching collections data went wrong',
      error: err.message,
    });
  }
};

const getOneProduct = async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    return res.status(422).json({ message: 'Product id is requried' });
  }

  try {
    const productData = await Product.findOne({ _id })
      .populate([
        { path: 'categories', select: ['value', 'label'] },
        {
          path: 'authors',
          select: ['userInfo.username', '_id', 'authorInfo.pseudonim'],
        },
      ])
      .lean();

    const preparedProduct = prepareData(productData);

    const comments = await Comment.find({ 'targetData._id': productData._id })
      .populate('creatorData')
      .lean();

    preparedProduct.comments = comments;

    return res.status(200).json({ data: preparedProduct });
  } catch (err) {
    return res.status(500).json({
      message: "We failed fetching product's data",
      error: err.message,
    });
  }
};

const addOneProduct = async (req, res) => {
  const preparedData = req.productData;

  try {
    const _id = new mongoose.Types.ObjectId();
    const createdAt = new Date().getTime();

    await Product.create({
      _id,
      createdAt,
      updatedAt: createdAt,
      ...preparedData,
    });
    return res
      .status(201)
      .json({ message: 'Succesfully added new product', id: _id });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Adding product failed', error: err.message });
  }
};

const updateOneProduct = async (req, res) => {
  const { _id } = req.body;
  const preparedData = req.preparedData;
  try {
    const updatedAt = new Date().getTime();

    await Product.updateOne({ _id }, { updatedAt, ...preparedData });

    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed', error: err.message });
  }
};

const deleteOneProduct = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(422).json({ message: 'Product id is required' });
  }

  try {
    const deleteDate = calculateFutureDeleteDate();

    await Product.updateOne({ _id }, { deleted: true, expireAt: deleteDate });
    return res
      .status(200)
      .json({ message: 'Successfully deleted the product' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed deleting selected product.',
      error: err.message,
    });
  }
};

const deleteAllCreatorProducts = async (req, res) => {
  const { userId, marketplace } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'User id is required' });
  }

  if (!marketplace) {
    return res.status(422).json({ message: 'Marketplace is required' });
  }

  try {
    const deleteDate = calculateFutureDeleteDate();

    await Product.updateMany(
      { 'creatorData._id': userId, marketplace },
      { deleted: true, expireAt: deleteDate },
    );

    return res
      .status(200)
      .json({ message: 'Successfully deleted all your products.' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed deleting all your prodcuts.',
      error: err.message,
    });
  }
};

const productsQuantity = async (req, res) => {
  const { authorId, marketplace, showSold, showDeleted } = req.query;
  const query = {
    ['creatorData._id']: authorId,
  };
  if (marketplace) {
    query.marketplace = marketplace;
  }
  if (!showSold) {
    query.sold = false;
    query.quantity = { $gt: 0 };
  }
  if (!showDeleted) {
    query.deleted = false;
  }
  try {
    const quantity = await Product.find(query).countDocuments();

    return res.status(200).json({ data: quantity });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed checking quantity of products.',
      error: err.message,
    });
  }
};

module.exports = {
  productsQuantity,
  getAllProducts,
  getCollectionProducts,
  getShopProducts,
  getOneProduct,
  addOneProduct,
  updateOneProduct,
  deleteOneProduct,
  deleteAllCreatorProducts,
};

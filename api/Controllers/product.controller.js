const { default: mongoose } = require('mongoose');
const Product = require('../Models/product');
const Comment = require('../Models/comment');
const Collection = require('../Models/collection');
const Order = require('../Models/order');

const calculateFutureDeleteDate = require('../helpers/calculate/calculateFutureDeleteDate');
const cashFormatter = require('../helpers/cashFormatter');

const getAllProducts = async (req, res) => {
  const query = req.preparedData;
  const { skipPages, currentPageSize, currentPage } = req.pageData;
  const sortMethod = req.sortMethod;
  const rawData = {};
  try {
    let flag = false;
    let skipPagesCopy = skipPages;
    do {
      productsData = await Product.find({
        ...query,
        deleted: false,
      })
        .sort(sortMethod)
        .skip(skipPagesCopy)
        .limit(currentPageSize)
        .populate('authors')
        .lean();
      if (productsData.length <= 0 && skipPages > 1 && currentPage > 1) {
        flag = true;
        skipPagesCopy -= skipPages;
        currentPage -= 1;
      } else {
        flag = false;
      }
    } while (flag);

    totalDocuments = await Product.find(query).countDocuments();
    totalPages = Math.ceil(totalDocuments / currentPageSize);

    const preparedData = [...productsData];

    for (let i = 0; i < productsData.length; i++) {
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }
    rawData.totalPages = totalPages;
    rawData.totalProducts = totalDocuments;

    return res.status(200).json({ data: { products: preparedData, rawData } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Fetching data went wrong', error: err.message });
  }
};

const getShopProducts = async (req, res) => {
  const { limit = 10 } = req.query;
  const sortMethod = req.sortMethod;
  const query = req.queryData;
  try {
    const productsData = await Product.find({
      marketplace: 'shop',
      quantity: { $gt: 0 },
      deleted: false,
      sold: false,
      ...query,
    })
      .sort(sortMethod)
      .populate('authors')
      .limit(limit)
      .lean();

    const preparedData = [...productsData];

    for (let i = 0; i < productsData.length; i++) {
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }

    const pipeline = [];
    if (query.categories) {
      pipeline.push({
        $match: {
          categories: query.categories,
        },
      });
    }
    pipeline.push({
      $group: {
        _id: null,
        maxNumber: { $max: '$price.value' },
      },
    });

    const highestPrice = await Product.aggregate(pipeline);

    const rawData = {};
    rawData.highestPrice =
      highestPrice.length > 0
        ? cashFormatter({ number: highestPrice[0].maxNumber })
        : cashFormatter({ number: 0 });

    return res.status(200).json({ data: { data: preparedData, rawData } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Fetching shop data went wrong', error: err.message });
  }
};

const getOneProduct = async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(422).json({ message: 'Product id is requried' });
  }

  try {
    const product = await Product.findOne({ _id: productId })
      .populate([
        { path: 'categories', select: ['value', 'label'] },
        {
          path: 'authors',
          select: [
            'user_info.credentials.full_name',
            '_id',
            'author_info.pseudonim',
          ],
        },
      ])
      .lean();

    const preparedProduct = { ...product };
    if (product.marketplace === 'collection') {
      const collectionsData = await Collection.find({
        products: product._id,
        deleted: false,
        sold: false,
        quantity: { $gt: 0 },
      })
        .populate('creatorData')
        .lean();
      preparedProduct.collections = collectionsData;
    }

    preparedProduct.price = {
      ...preparedProduct.price,
      value: `${cashFormatter({
        number: preparedProduct.price.value,
      })}`,
    };

    const comments = await Comment.find({ 'targetData._id': product._id })
      .populate('creatorData')
      .lean();
    preparedProduct.comments = comments;
    return res.status(200).json({ data: preparedProduct });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Fetching data went wrong', error: err.message });
  }
};

const getSearchedProducts = async (req, res) => {
  const { searchQuery, specialQuery } = req.finalSearchData;
  let { skipPages, currentPageSize, currentPage } = req.pageData;

  const sortMethod = req.sortMethod;

  const rawData = {};

  try {
    let productsData = null;
    let totalDocuments = null;
    let totalPages = null;
    if (specialQuery) {
      switch (specialQuery) {
        case 'bestseller': {
          const top_selling_products = await Order.aggregate([
            { $unwind: '$products' },
            {
              $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'product_doc',
              },
            },
            { $unwind: '$product_doc' },
            {
              $group: {
                _id: '$product_doc._id',
                sum: { $sum: '$products.in_cart_quantity' },
              },
            },
            { $sort: { sum: -1 } },
            { $limit: 6 },
            {
              $group: {
                _id: null,
                top_selling_products: {
                  $push: '$_id',
                },
              },
            },
          ]);
          if (top_selling_products.length > 0) {
            searchQuery._id = {
              $in: top_selling_products[0].top_selling_products,
            };
          }
          productsData = await Product.find({
            ...searchQuery,
            deleted: false,
          })
            .sort(sortMethod)
            .lean();

          totalDocuments = productsData.length;
          totalPages = Math.ceil(totalDocuments / currentPageSize);
          const pipeline = [];

          if (searchQuery) {
            pipeline.push({
              $match: {
                ...searchQuery,
              },
            });
          }
          pipeline.push({
            $group: {
              _id: null,
              maxNumber: { $max: '$price.value' },
            },
          });

          const highestPrice = await Product.aggregate(pipeline);
          rawData.highestPrice =
            highestPrice.length > 0
              ? cashFormatter({ number: highestPrice[0].maxNumber })
              : cashFormatter({ number: 0 });
          rawData.totalPages = totalPages;
          rawData.totalProducts = totalDocuments;
          break;
        }
        case 'latest': {
          productsData = await Product.find({ ...searchQuery })
            .lean()
            .sort(sortMethod)
            .limit(currentPageSize);
          break;
        }
      }
    } else {
      let flag = false;
      let skipPagesCopy = skipPages;
      do {
        productsData = await Product.find({
          ...searchQuery,
          deleted: false,
        })
          .sort(sortMethod)
          .skip(skipPagesCopy)
          .limit(currentPageSize)
          .populate('authors')
          .lean();
        if (productsData.length <= 0 && skipPages > 1 && currentPage > 1) {
          flag = true;
          skipPagesCopy -= skipPages;
          currentPage -= 1;
        } else {
          flag = false;
        }
      } while (flag);

      totalDocuments = await Product.find(searchQuery).countDocuments();
      totalPages = Math.ceil(totalDocuments / currentPageSize);
      const pipeline = [];
      if (searchQuery) {
        pipeline.push({
          $match: {
            ...searchQuery,
          },
        });
      }
      pipeline.push({
        $group: {
          _id: null,
          maxNumber: { $max: '$price.value' },
        },
      });

      const highestPrice = await Product.aggregate(pipeline);
      rawData.highestPrice =
        highestPrice.length > 0
          ? cashFormatter({ number: highestPrice[0].maxNumber })
          : cashFormatter({ number: 0 });
      rawData.totalPages = totalPages;
      rawData.totalProducts = totalDocuments;
    }
    let preparedData = null;

    if (productsData) {
      preparedData = [...productsData];
      for (let i = 0; i < productsData.length; i++) {
        preparedData[i].price = {
          ...preparedData[i].price,
          value: `${cashFormatter({
            number: preparedData[i].price.value,
          })}`,
        };
      }
    }
    return res.status(200).json({
      data: {
        products: preparedData,
        rawData,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Faield fetching searched query', error: err.message });
  }
};

const addOneProduct = async (req, res) => {
  const preparedData = req.productData;
  const { selectedCollections } = req.body;

  try {
    const _id = new mongoose.Types.ObjectId();
    const createdAt = new Date().getTime();

    if (preparedData.marketplace === 'shop') {
      try {
        await Product.create({
          _id,
          createdAt,
          updatedAt: createdAt,
          ...preparedData,
        });
      } catch (err) {
        return res
          .status(500)
          .json({ message: 'Failed creating new product', error: err.message });
      }
    }
    if (preparedData.marketplace === 'collection') {
      try {
        await Product.create({
          _id,
          createdAt,
          updatedAt: createdAt,
          ...preparedData,
        });

        for (let i = 0; i < selectedCollections.length; i++) {
          await Collection.updateOne(
            { _id: selectedCollections[i] },
            { $push: { products: _id } },
          );
        }
      } catch (err) {
        return res
          .status(500)
          .json({ message: 'Failed creating new product', error: err.message });
      }
    }

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
  const { _id, selectedCollections } = req.body;
  const preparedData = req.preparedData;

  try {
    const updatedAt = new Date().getTime();
    const productData = await Product.findOne(
      { _id },
      { marketplace: 1 },
    ).lean();

    if (
      preparedData.marketplace &&
      productData.marketplace !== preparedData.marketplace
    ) {
      await Collection.updateMany(
        { products: _id },
        { $pull: { products: _id } },
      );
    }

    if (preparedData.marketplace === 'collection') {
      if (!selectedCollections || selectedCollections.length <= 0) {
        return res.status(422).json({ message: 'Please select sollections' });
      }

      for (let i = 0; i < selectedCollections.length; i++) {
        await Collection.updateOne(
          { _id: selectedCollections[i] },
          { $push: { products: _id } },
        );
      }
      await Product.updateOne({ _id }, { ...preparedData, updatedAt });
    } else {
      await Product.updateOne({ _id }, { ...preparedData, updatedAt });
    }

    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed', error: err.message });
  }
};

const deleteOneProduct = async (req, res) => {
  const { _id, marketplace } = req.body;

  if (!_id) {
    return res.status(422).json({ message: 'Product id is required' });
  }

  try {
    if (marketplace === 'collection') {
      await Collection.updateMany({}, { $pull: { products: _id } });
    }

    const deleteDate = calculateFutureDeleteDate();

    await Product.updateOne({ _id }, { deleted: true, expireAt: deleteDate });
    return res
      .status(200)
      .json({ message: 'Successfully deleted the product' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed deleting selected product',
      error: err.message,
    });
  }
};

const deleteAllProducts = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'User id is required' });
  }
  try {
    const deleteDate = calculateFutureDeleteDate();

    await Product.updateMany(
      { 'creatorData._id': userId },
      { deleted: true, expireAt: deleteDate },
    );
    await Collection.updateMany({}, { products: [] });

    return res
      .status(200)
      .json({ message: 'Successfully deleted all products' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed deleting all prodcuts', error: err.message });
  }
};

const productsQuantity = async (req, res) => {
  const { authorId } = req.query;
  try {
    const quantity = await Product.find({
      'creatorData._id': authorId,
    }).count();
    return res.status(200).json({ data: quantity });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed deleting all prodcuts', error: err.message });
  }
};

module.exports = {
  productsQuantity,
  getAllProducts,
  getShopProducts,
  getOneProduct,
  addOneProduct,
  updateOneProduct,
  deleteOneProduct,
  getSearchedProducts,
  deleteAllProducts,
};

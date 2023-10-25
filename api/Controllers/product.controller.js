const { default: mongoose } = require('mongoose');
const Product = require('../Models/product');
const User = require('../Models/user');
const Category = require('../Models/category');
const Order = require('../Models/order');
const prepareProductObject = require('../helpers/prepareProductObject');

const getAllProducts = async (req, res) => {
  const { category } = req.query;

  try {
    let products = null;
    if (category) {
      products = await Product.find({
        quantity: { $gt: 0 },
        deleted: false,
      });
    } else {
      products = await Product.find({
        quantity: { $gt: 0 },
        deleted: false,
      });
    }
    const preparedProducts = [];
    for (let product of products) {
      preparedProducts.push(prepareProductObject(product));
    }

    return res.status(200).json({ data: preparedProducts });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Fetching data went wrong', error: err.message });
  }
};

const getShopProducts = async (req, res) => {
  try {
    const products = await Product.find({
      market_place: 'Shop',
      quantity: { $gt: 0 },
      deleted: false,
    }).populate('authors');

    const preparedProducts = [];
    for (let product of products) {
      preparedProducts.push(prepareProductObject(product));
    }

    return res.status(200).json({ data: preparedProducts });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Fetching shop data went wrong', error: err.message });
  }
};

const getAuctionProducts = async (req, res) => {
  try {
    const products = await Product.find({
      market_place: 'Auction',
      quantity: { $gt: 0 },
      deleted: false,
    });

    const preparedProducts = [];
    for (let product of products) {
      preparedProducts.push(prepareProductObject(product));
    }

    return res.status(200).json({ data: preparedProducts });
  } catch (err) {
    return res.status(500).json({
      message: 'Fetching auction data went wrong',
      error: err.message,
    });
  }
};

const getOneProduct = async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(422).json({ message: 'Product id is requried' });
  }

  try {
    const product = await Product.findOne({ _id: productId }).populate([
      {
        path: 'comments',
        populate: { path: 'user' },
      },
      { path: 'categories', select: ['value', 'label'] },
      {
        path: 'authors',
        select: [
          'user_info.credentials.full_name',
          '_id',
          'author_info.pseudonim',
        ],
      },
    ]);
    const preparedProduct = prepareProductObject(product);
    return res.status(200).json({ data: preparedProduct });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Fetching data went wrong', error: err.message });
  }
};

const getSearchedProducts = async (req, res) => {
  let {
    rawData,
    searchQuery,
    sortMethod,
    skipPages,
    currentPageSize,
    specialQuery,
    currentPage,
  } = req.finalSearchData;

  try {
    let products = null;
    let highestPrice = null;
    let totalDocuments = null;
    let totalPages = null;
    searchQuery.quantity = { $gt: 0 };
    searchQuery.deleted = false;
    if (specialQuery) {
      switch (specialQuery) {
        case "bestseller":
          {
            const top_selling_products = await Order.aggregate([
              { $unwind: "$products" },
              {
                $lookup: {
                  from: "products",
                  localField: "products.product",
                  foreignField: "_id",
                  as: "product_doc",
                },
              },
              { $unwind: "$product_doc" },
              {
                $group: {
                  _id: "$product_doc._id",
                  sum: { $sum: "$products.in_cart_quantity" },
                },
              },
              { $sort: { sum: -1 } },
              { $limit: 6 },
              {
                $group: {
                  _id: null,
                  top_selling_products: {
                    $push: "$_id",
                  },
                },
              },
            ]);
            if (top_selling_products.length > 0) {
              searchQuery._id = {
                $in: top_selling_products[0].top_selling_products,
              };
            }
            products = await Product.find(searchQuery).sort(sortMethod);
            const products_copy = [...products];
            highestPrice =
              products_copy.length >= 1
                ? products_copy.sort(
                    (a, b) =>
                      Number(b.shop_info.price) - Number(a.shop_info.price)
                  )
                : null;
            totalDocuments = products.length;
            totalPages = Math.ceil(totalDocuments / currentPageSize);
          }
          break;
      }
    } else {
      let flag = false;
      let skipPagesCopy = skipPages;
      do {
        products = await Product.find(searchQuery)
          .sort(sortMethod)
          .skip(skipPagesCopy)
          .limit(currentPageSize)
          .populate("authors");
        if (products.length <= 0 && skipPages > 1 && currentPage > 1) {
          flag = true;
          skipPagesCopy -= skipPages;
          currentPage -= 1;
        } else {
          flag = false;
        }
      } while (flag);

      highestPrice = await Product.find({ deleted: false })
        .sort({ "shop_info.price": -1 })
        .limit(1);
      totalDocuments = await Product.find(searchQuery).countDocuments();
      totalPages = Math.ceil(totalDocuments / currentPageSize);
    }
    rawData.totalPages = totalPages;
    rawData.totalProducts = totalDocuments;
    rawData.highestPrice =
      highestPrice && highestPrice.length > 0
        ? Number(highestPrice[0].shop_info.price)
        : 0;

    const preparedProducts = [];
    if (products.length >= 1) {
      for (let product of products) {
        preparedProducts.push(prepareProductObject(product));
      }
    }
    return res.status(200).json({
      data: {
        products: preparedProducts,
        rawData,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Faield fetching searched query", error: err.message });
  }
};

const addOneProduct = async (req, res) => {
  const {
    seller_data,
    price,
    title,
    description,
    categories,
    authors,
    quantity,
    market_place,
    created_at,
    starting_price,
    auction_end_date,
  } = req.body;
  if (categories && categories.length > 0) {
    try {
      for (const item of categories) {
        const categoryExists = await Category.find({ _id: item._id });
        if (categoryExists.length < 1) {
          await Category.create({
            value: item.value,
            label: item.label,
            description: item.description,
          });
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Failed verifying categories', error: err.message });
    }
  }
  try {
    const _id = new mongoose.Types.ObjectId();

    if (market_place === 'Shop') {
      try {
        await Product.create({
          seller_data,
          _id,
          title,
          description,
          imgs: [],
          categories,
          authors,
          rating: [],
          quantity,
          market_place,
          created_at,
          comments: [],
          avgRating: 0,
          shop_info: {
            price: price.toString(),
          },
        });
      } catch (err) {
        return res
          .status(500)
          .json({ message: 'Failed creating new product', error: err.message });
      }
    } else {
      if (typeof starting_price !== 'number') {
        return res.status(422).json({
          message: 'Starting price, currency and auction end date are required',
        });
      }

      try {
        await Product.create({
          seller_data,
          _id,
          title,
          description,
          imgs: [],
          categories,
          authors,
          rating: [],
          quantity,
          market_place,
          created_at,
          comments: [],
          auction_info: {
            starting_price,
            auction_end_date,
          },
        });
      } catch (err) {
        return res
          .status(500)
          .json({ message: 'Failed creating new product', error: err.message });
      }
    }

    try {
      await User.updateOne(
        {
          _id: seller_data._id,
        },
        { $push: { 'author_info.my_products': _id } },
      );
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Failed updating user data', error: err.message });
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
  const {
    _id,
    title,
    description,
    price,
    imgs,
    categories,
    authors,
    quantity,
    market_place,
    auction_info,
  } = req.body;
  try {
    if (market_place === 'Shop') {
      await Product.updateOne(
        { _id },
        {
          title,
          description,
          'shop_info.price': price,
          imgs,
          categories,
          authors,
          quantity,
          market_place,
        },
      );
    } else {
      await Product.updateOne(
        { _id },
        {
          title,
          description,
          auction_info,
          imgs,
          categories,
          authors,
          quantity,
          market_place,
        },
      );
    }
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed', error: err.message });
  }
};

const deleteOneProduct = async (req, res) => {
  const { _id, userId } = req.body;

  if (!_id) {
    return res.status(422).json({ message: 'Id is required' });
  }

  if (!userId) {
    return res.status(422).json({ message: 'User id is required' });
  }

  try {
    await User.updateOne(
      { _id: userId },
      { $pull: { 'author_info.my_products': _id } },
    );
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let monthFromNow = currentMonth + 6;
    let futureDate = new Date(currentDate.getFullYear(), monthFromNow, 1);
    futureDate.setDate(futureDate.getDate() - 1);

    await Product.updateOne({ _id }, { deleted: true, expireAt: futureDate });
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed updating one product', error: err.message });
  }
};

const deleteAllProducts = async (req, res) => {
  const { userId } = req.body;
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { 'author_info.my_products': [] } },
    );
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let monthFromNow = currentMonth + 6;
    let futureDate = new Date(currentDate.getFullYear(), monthFromNow, 1);
    futureDate.setDate(futureDate.getDate() - 1);

    await Product.updateMany(
      { 'seller_data._id': userId },
      { deleted: true, expireAt: futureDate },
    );

    res.status(200).json({ message: 'Successfully deleted all products' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed deleting all prodcuts', error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getShopProducts,
  getAuctionProducts,
  getOneProduct,
  addOneProduct,
  updateOneProduct,
  deleteOneProduct,
  getSearchedProducts,
  deleteAllProducts,
};

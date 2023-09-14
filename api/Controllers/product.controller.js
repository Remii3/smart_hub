const { default: mongoose } = require('mongoose');
const Product = require('../Models/product');
const User = require('../Models/user');
const Category = require('../Models/category');
const Order = require('../Models/order');
const prepareProductObject = require('../helpers/prepareProductObject');

const allProducts = async (req, res) => {
  const { category } = req.params;
  try {
    let products = null;
    if (category) {
      products = await Product.find({
        quantity: { $gt: 0 },
      });
    } else {
      products = await Product.find({
        quantity: { $gt: 0 },
      });
    }
    const preparedProducts = [];
    for (let product of products) {
      preparedProducts.push(prepareProductObject(product));
    }

    res.status(200).json(preparedProducts);
  } catch (err) {
    res.status(500).json({ message: 'Fetching data went wrong' });
  }
};

const shopProducts = async (req, res) => {
  try {
    const products = await Product.find({
      market_place: 'Shop',
      quantity: { $gt: 0 },
    });

    const preparedProducts = [];
    for (let product of products) {
      preparedProducts.push(prepareProductObject(product));
    }

    res.status(200).json(preparedProducts);
  } catch (err) {
    res.status(500).json({ message: 'Fetching shop data went wrong' });
  }
};

const auctionProducts = async (req, res) => {
  try {
    const products = await Product.find({
      market_place: 'Auction',
      quantity: { $gt: 0 },
    });

    const preparedProducts = [];
    for (let product of products) {
      preparedProducts.push(prepareProductObject(product));
    }

    res.status(200).json(preparedProducts);
  } catch (err) {
    res.status(500).json({ message: 'Fetching auction data went wrong' });
  }
};

const oneProduct = async (req, res) => {
  const { productId } = req.query;

  if (!productId) res.status(422).json({ message: 'Product id is requried' });

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
    res.status(200).json(preparedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Fetching data went wrong' });
  }
};

const searchedProducts = async (req, res) => {
  let {
    finalRawData,
    searchQuery,
    sortMetod,
    skipPages,
    limitPages,
    pageSize,
    specialQuery,
  } = req.finalSearchData;

  try {
    let products = null;
    let highestPrice = null;
    let totalDocuments = null;
    let totalPages = null;
    searchQuery.quantity = { $gt: 0 };
    if (specialQuery) {
      switch (specialQuery) {
        case 'bestseller':
          {
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
            searchQuery._id = {
              $in: top_selling_products[0].top_selling_products,
            };
            products = await Product.find(searchQuery).sort(sortMetod);
            const products_copy = [...products];
            highestPrice =
              products_copy.length >= 1
                ? products_copy.sort(
                    (a, b) =>
                      Number(b.shop_info.price) - Number(a.shop_info.price),
                  )
                : null;
            totalDocuments = products.length;
            totalPages = Math.ceil(totalDocuments / pageSize);
          }
          break;
      }
    } else {
      products = await Product.find(searchQuery)
        .sort(sortMetod)
        .skip(skipPages)
        .limit(limitPages);
      highestPrice = await Product.find({})
        .sort({ 'shop_info.price': -1 })
        .limit(1);
      totalDocuments = await Product.find(searchQuery).countDocuments();
      totalPages = Math.ceil(totalDocuments / pageSize);
    }
    finalRawData.totalPages = totalPages;
    finalRawData.totalProducts = totalDocuments;

    finalRawData.highestPrice = highestPrice
      ? Number(highestPrice[0].shop_info.price)
      : 0;

    const preparedProducts = [];
    if (products.length >= 1) {
      for (let product of products) {
        preparedProducts.push(prepareProductObject(product));
      }
    }
    res.status(200).json({
      products: preparedProducts,
      finalRawData,
    });
  } catch (err) {
    res.status(500).json({ message: 'Faield fetching searched query' });
  }
};

const addProduct = async (req, res) => {
  const {
    price,
    title,
    description,
    img,
    categories,
    authors,
    quantity,
    market_place,
    created_at,
    starting_price,
    auction_end_date,
  } = req.body.newProductData;
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
    return res.status(500).json({ message: 'Failed verifying categories' });
  }
  try {
    const _id = new mongoose.Types.ObjectId();

    if (market_place === 'Shop') {
      if (typeof price !== 'number') {
        return res.status(400).json({ message: 'Price is required' });
      }

      try {
        await Product.create({
          _id,
          title,
          description,
          img,
          categories,
          authors,
          rating: 0,
          quantity,
          market_place,
          created_at,
          comments: [],
          shop_info: {
            price: price.toString(),
          },
        });
      } catch (err) {
        return res.status(500).json({ message: 'Failed creating new product' });
      }
    } else {
      if (typeof starting_price !== 'number') {
        return res.status(400).json({
          message: 'starting price, currency and auction end date are required',
        });
      }

      try {
        await Product.create({
          _id,
          title,
          description,
          img,
          categories,
          authors,
          rating: 0,
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
        return res.status(500).json({ message: 'Failed creating new product' });
      }
    }

    try {
      for (const author of authors) {
        await User.updateOne(
          {
            _id: author._id,
          },
          { $push: { 'author_info.my_products': _id } },
        );
      }
    } catch (err) {
      return res.status(500).json({ message: 'Failed updating user data' });
    }

    res.status(201).json({ message: 'Succesfully added enw product' });
  } catch (err) {
    res.status(500).json({ message: 'Adding product failed' });
  }
};

const updateProduct = async (req, res) => {
  const {
    _id,
    title,
    description,
    shop_info,
    img,
    categories,
    authors,
    quantity,
    market_place,
    auction_info,
  } = req.body;
  try {
    if (market_place === "Shop") {
      await Product.updateOne(
        { _id },
        {
          title,
          description,
          shop_info,
          img,
          categories,
          authors,
          quantity,
          market_place,
        }
      );
    } else {
      await Product.updateOne(
        { _id },
        {
          title,
          description,
          auction_info,
          img,
          categories,
          authors,
          quantity,
          market_place,
        }
      );
    }
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};

const deleteProduct = async (req, res) => {
  const { _id, userId } = req.body;
  try {
    await User.updateOne(
      { _id: userId },
      { $pull: { 'my_products.$._id': _id } },
    );
    await Product.deleteOne({ _id });
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Failed' });
  }
};

module.exports = {
  allProducts,
  shopProducts,
  auctionProducts,
  oneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  searchedProducts,
};

const { default: mongoose } = require('mongoose');
const Product = require('../Models/product');
const User = require('../Models/user');
const Category = require('../Models/category');
const prepareProductObject = require('../helpers/prepareProductObject');

const allProducts = async (req, res) => {
  try {
    const products = await Product.find();

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
    const products = await Product.find({ market_place: 'Shop' });

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
    const products = await Product.find({ market_place: 'Auction' });

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
  let { phrase, page, pageSize, filtersData, sortOption } = req.query;
  if (!page) page = 1;
  if (!pageSize) pageSize = 10;
  let sort = {};
  switch (sortOption) {
    case 'Date, ASC':
      sort.created_at = 1;
      break;
    case 'Date, DESC':
      sort.created_at = -1;
      break;

    case 'Title, ASC':
      sort.title = 1;
      break;

    case 'Title, DESC':
      sort.title = -1;
      break;

    case 'Price, DESC':
      sort['shop_info.price'] = -1;
      break;

    case 'Price, ASC':
      sort['shop_info.price'] = 1;
      break;
  }
  const skip = (page - 1) * pageSize;

  const searchParams = new URLSearchParams(phrase);
  const finalQuery = {};
  const finalRawData = {};
  for (const [key, value] of searchParams.entries()) {
    if (key === 'phrase') {
      finalQuery['$text'] = { $search: `${value}` };
      finalRawData[key] = value;
    }
    if (key === 'category') {
      const category = await Category.findOne({ value: value });
      finalQuery['categories'] = category._id;
      finalRawData[key] = value;
    }
  }

  const marketplaces = filtersData.marketplace.filter(item => {
    return item.isChecked === 'true';
  });

  const names = [];
  marketplaces.forEach(item => {
    names.push(item.name.charAt(0).toUpperCase() + item.name.slice(1));
  });

  finalQuery['market_place'] = { $in: names };

  if (
    filtersData.price.minPrice !== '' &&
    filtersData.price.minPrice >= 1 &&
    filtersData.price.maxPrice !== '' &&
    filtersData.price.maxPrice >= 1
  ) {
    finalQuery['shop_info.price'] = {
      $gte: Number(filtersData.price.minPrice),
      $lte: Number(filtersData.price.maxPrice),
    };
  } else if (
    filtersData.price.minPrice !== '' &&
    filtersData.price.minPrice >= 1
  ) {
    finalQuery['shop_info.price'] = {
      $gte: Number(filtersData.price.minPrice),
    };
  } else if (
    filtersData.price.maxPrice !== '' &&
    filtersData.price.maxPrice >= 1
  ) {
    finalQuery['shop_info.price'] = {
      $lte: Number(filtersData.price.maxPrice),
    };
  }

  try {
    const products = await Product.find(finalQuery)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    const highestPrice = await Product.find({})
      .sort({ 'shop_info.price': -1 })
      .limit(1);
    const totalDocuments = await Product.find(finalQuery).countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);
    finalRawData.totalPages = totalPages;
    finalRawData.totalProducts = totalDocuments;
    finalRawData.highestPrice = Number(highestPrice[0].shop_info.price);

    const preparedProducts = [];
    for (let product of products) {
      preparedProducts.push(prepareProductObject(product));
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
      console.log(err);
      return res.status(500).json({ message: 'Failed updating user data' });
    }

    res.status(201).json({ message: 'Succesfully added enw product' });
  } catch (err) {
    res.status(500).json({ message: 'Adding product failed' });
  }
};

const updateProduct = async (req, res) => {
  const {
    title,
    description,
    shop_info,
    img,
    categories,
    authors,
    quantity,
    market_place,
    auction_info,
  } = req.body.newProductData;
  try {
    if (market_place === 'Shop') {
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
        },
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
        },
      );
    }
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Failed' });
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

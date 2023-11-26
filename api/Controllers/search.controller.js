const Order = require('../Models/order');
const Product = require('../Models/product');
const cashFormatter = require('../helpers/cashFormatter');

const getHighestPrice = async (pipeline, rawData) => {
  const highestPrice = await Product.aggregate(pipeline);
  rawData.highestPrice =
    highestPrice.length > 0
      ? cashFormatter({ number: highestPrice[0].maxNumber })
      : cashFormatter({ number: 0 });

  return highestPrice;
};

const prepareData = originalData => {
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
};

const getBestseller = async (query, sortMethod, currentPageSize) => {
  const searchQuery = { ...query };
  const rawData = {};
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

  const productsData = await Product.find({
    ...searchQuery,
    deleted: false,
  })
    .populate('categories')
    .sort(sortMethod)
    .lean();

  const totalDocuments = productsData.length;
  const totalPages = Math.ceil(totalDocuments / currentPageSize);
  rawData.totalPages = totalPages;
  rawData.totalProducts = totalDocuments;

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

  getHighestPrice(pipeline, rawData);

  const preparedData = prepareData(productsData);
  return { data: preparedData, rawData };
};

const getLatest = async () => {
  productsData = await Product.find({ ...searchQuery })
    .lean()
    .sort(sortMethod)
    .limit(currentPageSize);
};

const getDefault = async (
  query,
  withPagination,
  widthHighestPrice,
  sortMethod,
  currentPageSize,
  skipPagesCopy,
) => {
  const searchQuery = { ...query };
  const rawData = {};
  const productsData = await Product.find({
    ...searchQuery,
    deleted: false,
  })
    .sort(sortMethod)
    .skip(skipPagesCopy)
    .limit(currentPageSize)
    .populate(['authors', 'categories'])
    .lean();

  if (withPagination) {
    const totalDocuments = await Product.find(searchQuery).countDocuments();
    const totalPages = Math.ceil(totalDocuments / currentPageSize);
    rawData.totalPages = totalPages;
    rawData.totalProducts = totalDocuments;
  }
  if (widthHighestPrice) {
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

    getHighestPrice(pipeline, rawData);
  }

  const preparedData = prepareData(productsData);
  return { data: preparedData, rawData };
};

const mainSearch = async (req, res) => {
  const {
    searchType,
    withPagination = false,
    widthHighestPrice = false,
  } = req.query;
  const { searchQuery } = req.finalSearchData;
  let { skipPages, currentPageSize, currentPage, marketplace } = req.pageData;
  const sortMethod = req.sortMethod;
  try {
    switch (searchType) {
      case 'bestseller': {
        const data = await getBestseller(
          searchQuery,
          sortMethod,
          currentPageSize,
        );
        return res.status(200).json({
          data,
        });
      }
      case 'latest': {
        const data = await getLatest();
        return res.status(200).json({
          data,
        });
      }
      default: {
        const data = await getDefault(
          searchQuery,
          withPagination,
          widthHighestPrice,
          sortMethod,
          currentPageSize,
          skipPages,
        );
        return res.status(200).json({
          data,
        });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Faield fetching searched query', error: err.message });
  }
};

module.exports = {
  mainSearch,
};

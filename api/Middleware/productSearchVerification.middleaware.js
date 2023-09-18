const Category = require('../Models/category');

const productSearchVerification = async (req, res, next) => {
  let { phrase, page, pageSize, filtersData, sortOption } = req.query;

  let currentPage = page;
  if (!currentPage) {
    currentPage = 1;
  }

  let currentPageSize = pageSize;
  if (!currentPageSize) {
    currentPageSize = 10;
  }

  const skip = (currentPage - 1) * currentPageSize;

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

  const searchParams = new URLSearchParams(phrase);
  const finalQuery = {};
  const finalRawData = { queries: [] };
  let specialQuery = null;
  for (const [key, value] of searchParams.entries()) {
    if (key === 'phrase') {
      finalQuery['$text'] = { $search: `${value}` };
      finalRawData.queries = [...finalRawData.queries, { key, value }];
    }
    if (key === 'category') {
      const category = await Category.findOne({ value });
      finalQuery['categories'] = category._id;
      finalRawData.queries = [...finalRawData.queries, { key, value }];
    }
    if (key === 'special') {
      specialQuery = value;
      finalRawData.queries = [...finalRawData.queries, { key, value }];
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
  req.finalSearchData = {
    searchQuery: finalQuery,
    sortMetod: sort,
    skipPages: skip,
    limitPages: currentPageSize,
    pageSize: currentPageSize,
    finalRawData: finalRawData,
    specialQuery: specialQuery,
  };
  next();
};

module.exports = productSearchVerification;

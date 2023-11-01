const Category = require('../Models/category');
const User = require('../Models/user');

const productSearchVerification = async (req, res, next) => {
  let { pageSize, filtersData } = req.query;

  if (!filtersData) {
    return res.status(422).json({
      message: 'No filters provided',
      error: 'Please provide filters data',
    });
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

  let sortMethod = {};
  switch (filtersData.sortOption) {
    case 'Date, ASC':
      sortMethod.created_at = 1;
      break;
    case 'Date, DESC':
      sortMethod.created_at = -1;
      break;
    case 'Title, ASC':
      sortMethod.title = 1;
      break;
    case 'Title, DESC':
      sortMethod.title = -1;
      break;
    case 'Price, DESC':
      sortMethod['shop_info.price'] = -1;
      break;
    case 'Price, ASC':
      sortMethod['shop_info.price'] = 1;
      break;
    default:
      return (sortMethod.created_at = -1);
  }

  const searchQuery = {};
  let specialQuery = null;

  const rawData = { queries: {} };

  if (filtersData.searchedPhrase) {
    searchQuery['$text'] = { $search: `${filtersData.searchedPhrase}` };
    rawData.queries.phrase = filtersData.searchedPhrase;
  }
  if (filtersData.searchedSpecial) {
    specialQuery = filtersData.searchedSpecial;
    rawData.queries.special = filtersData.searchedSpecial;
  }

  if (filtersData.selectedAuthors && filtersData.selectedAuthors.length > 0) {
    const authors = [];

    for (let i = 0; i < filtersData.selectedAuthors.length; i++) {
      const author = await User.findOne({
        'author_info.pseudonim': filtersData.selectedAuthors[i],
      });
      if (author) {
        authors.push(author._id);
      }
    }

    searchQuery['authors'] = { $in: authors };
    rawData.queries.authors = authors;
  }

  if (
    filtersData.selectedCategories &&
    filtersData.selectedCategories.length > 0
  ) {
    const categories = [];

    for (let i = 0; i < filtersData.selectedCategories.length; i++) {
      const category = await Category.findOne({
        value: filtersData.selectedCategories[i],
      });
      if (category) {
        categories.push(category._id);
      }
    }

    searchQuery['categories'] = { $in: categories };
    rawData.queries.categories = categories;
  }

  if (filtersData.marketplace) {
    const marketplaces = [];
    filtersData.marketplace.forEach(item => {
      marketplaces.push(item.charAt(0).toUpperCase() + item.slice(1));
    });
    searchQuery['market_place'] = { $in: marketplaces };
    rawData.queries.marketplace = marketplaces;
  }

  if (
    filtersData.selectedPriceRange.minPrice &&
    filtersData.selectedPriceRange.minPrice >= 1 &&
    filtersData.selectedPriceRange.maxPrice &&
    filtersData.selectedPriceRange.maxPrice >= 1
  ) {
    searchQuery['shop_info.price'] = {
      $gte: Number(filtersData.selectedPriceRange.minPrice),
      $lte: Number(filtersData.selectedPriceRange.maxPrice),
    };
    rawData.queries.minPrice = filtersData.selectedPriceRange.minPrice;
    rawData.queries.maxPrice = filtersData.selectedPriceRange.maxPrice;
  } else if (
    filtersData.selectedPriceRange.minPrice &&
    filtersData.selectedPriceRange.minPrice >= 1
  ) {
    searchQuery['shop_info.price'] = {
      $gte: Number(filtersData.selectedPriceRange.minPrice),
    };
    rawData.queries.minPrice = filtersData.selectedPriceRange.minPrice;
  } else if (
    filtersData.selectedPriceRange.maxPrice &&
    filtersData.selectedPriceRange.maxPrice >= 1
  ) {
    searchQuery['shop_info.price'] = {
      $lte: Number(filtersData.selectedPriceRange.maxPrice),
    };
    rawData.queries.maxPrice = filtersData.selectedPriceRange.maxPrice;
  }

  if (filtersData.selectedRating) {
    searchQuery['avgRating'] = {
      $lte: filtersData.selectedRating,
    };
    rawData.queries.rating = filtersData.selectedRating;
  }

  req.finalSearchData = {
    searchQuery,
    sortMethod,
    skipPages,
    currentPageSize,
    rawData,
    specialQuery,
    currentPage,
  };
  next();
};

module.exports = productSearchVerification;

const Category = require('../Models/category');
const User = require("../Models/user");

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
console.log("filtersData: ", filtersData);
const searchParams = new URLSearchParams(phrase);
const finalQuery = {};
const finalRawData = { queries: [] };
let specialQuery = null;
for (const [key, value] of searchParams.entries()) {
  if (key === "phrase") {
    finalQuery["$text"] = { $search: `${value}` };
    finalRawData.queries = [...finalRawData.queries, { key, value }];
  }

  if (key === "special") {
    specialQuery = value;
    finalRawData.queries = [...finalRawData.queries, { key, value }];
  }
}
if (filtersData.selectedAuthors && filtersData.selectedAuthors.length > 0) {
  const authors = [];

  for (let i = 0; i < filtersData.selectedAuthors.length; i++) {
    const author = await User.findOne({
      "author_info.pseudonim": filtersData.selectedAuthors[i],
    });
    authors.push(author._id);
  }

  finalQuery["authors"] = { $in: authors };
  finalRawData.queries = [...finalRawData.queries];
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
    categories.push(category._id);
  }

  finalQuery["categories"] = { $in: categories };
  finalRawData.queries = [...finalRawData.queries];
}

const marketplaces = filtersData.marketplace;
const names = [];
if (marketplaces) {
  marketplaces.forEach((item) => {
    names.push(item.charAt(0).toUpperCase() + item.slice(1));
  });
}

finalQuery["market_place"] = { $in: names };

  if (
    filtersData.selectedPriceRange.minPrice &&
    filtersData.selectedPriceRange.minPrice >= 1 &&
    filtersData.selectedPriceRange.maxPrice &&
    filtersData.selectedPriceRange.maxPrice >= 1
  ) {
    finalQuery['shop_info.price'] = {
      $gte: Number(filtersData.selectedPriceRange.minPrice),
      $lte: Number(filtersData.selectedPriceRange.maxPrice),
    };
  } else if (
    filtersData.selectedPriceRange.minPrice &&
    filtersData.selectedPriceRange.minPrice >= 1
  ) {
    finalQuery['shop_info.price'] = {
      $gte: Number(filtersData.selectedPriceRange.minPrice),
    };
  } else if (
    filtersData.selectedPriceRange.maxPrice &&
    filtersData.selectedPriceRange.maxPrice >= 1
  ) {
    finalQuery['shop_info.price'] = {
      $lte: Number(filtersData.selectedPriceRange.maxPrice),
    };
  }

  if (filtersData.selectedRating) {
    finalQuery['avgRating'] = {
      $lte: filtersData.selectedRating,
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
    currentPage,
  };
  next();
};

module.exports = productSearchVerification;

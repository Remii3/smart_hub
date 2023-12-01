const Category = require('../../Models/category');
const User = require('../../Models/user');

const prodCol = async (req, res, next) => {
  let { pageSize, filtersData } = req.query;
  if (!filtersData) {
    filtersData = {};
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

  const searchQuery = {};
  let specialQuery = null;

  if (filtersData.searchedPhrase) {
    searchQuery['$text'] = { $search: `${filtersData.searchedPhrase}` };
  }
  if (filtersData.searchedSpecial) {
    specialQuery = filtersData.searchedSpecial;
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
  }

  if (filtersData.marketplace) {
    searchQuery['marketplace'] =
      typeof filtersData.marketplace === 'string'
        ? filtersData.marketplace
        : { $in: filtersData.marketplace };
  } else if (filtersData.strictMarketplace) {
    searchQuery['marketplace'] = { $in: [] };
  }

  if (filtersData.selectedPriceRange) {
    if (
      filtersData.selectedPriceRange.minPrice &&
      filtersData.selectedPriceRange.minPrice >= 1 &&
      filtersData.selectedPriceRange.maxPrice &&
      filtersData.selectedPriceRange.maxPrice >= 1
    ) {
      searchQuery['price.value'] = {
        $gte: Number(filtersData.selectedPriceRange.minPrice),
        $lte: Number(filtersData.selectedPriceRange.maxPrice),
      };
    } else if (
      filtersData.selectedPriceRange.minPrice &&
      filtersData.selectedPriceRange.minPrice >= 1
    ) {
      searchQuery['price.value'] = {
        $gte: Number(filtersData.selectedPriceRange.minPrice),
      };
    } else if (
      filtersData.selectedPriceRange.maxPrice &&
      filtersData.selectedPriceRange.maxPrice >= 1
    ) {
      searchQuery['price.value'] = {
        $lte: Number(filtersData.selectedPriceRange.maxPrice),
      };
    }
  }

  if (filtersData.selectedRating) {
    searchQuery['rating.avgRating'] = {
      $lte: Number(filtersData.selectedRating),
    };
  }

  if (!filtersData.showSold) {
    searchQuery.sold = false;
    searchQuery.quantity = { $gt: 0 };
  }

  if (!filtersData.showDeleted) {
    searchQuery.deleted = false;
  }

  req.finalSearchData = {
    searchQuery,
    specialQuery,
  };
  req.pageData = {
    skipPages,
    currentPageSize,
    currentPage,
    marketplace: filtersData.marketplace,
  };
  next();
};

module.exports = prodCol;

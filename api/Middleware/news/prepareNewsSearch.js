const prepareNewsSearch = (req, res, next) => {
  let { pageSize, filtersData } = req.query;
  const searchQuery = {};
  if (!filtersData) {
    filtersData = { page: 1 };
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

  if (filtersData.searchedPhrase) {
    searchQuery.title = { $regex: new RegExp(filtersData.searchedPhrase, 'i') };
  }

  req.finalSearchData = {
    searchQuery,
  };

  req.pageData = {
    skipPages,
    currentPageSize,
    currentPage,
  };
  next();
};
module.exports = prepareNewsSearch;

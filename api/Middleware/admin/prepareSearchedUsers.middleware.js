const prepareSearchedUsers = (req, res, next) => {
  let { pageSize, filtersData } = req.query;
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

  const searchQuery = {};

  if (filtersData.searchedPhrase) {
    searchQuery['$or'] = [
      { username: { $regex: new RegExp(filtersData.searchedPhrase, 'i') } },
      { email: { $regex: new RegExp(filtersData.searchedPhrase, 'i') } },
    ];
  }
  req.paginationInfo = { skipPages, currentPageSize };
  req.searchQuery = searchQuery;
  next();
};

module.exports = prepareSearchedUsers;

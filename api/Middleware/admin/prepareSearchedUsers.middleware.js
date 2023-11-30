const prepareSearchedUsers = (req, res, next) => {
  const { page, pageSize } = req.query;
  const query = {};
  let currentPage = page;

  if (!currentPage) {
    currentPage = 1;
  }

  let currentPageSize = pageSize;
  if (!currentPageSize) {
    currentPageSize = 10;
  }

  const skipPages = (currentPage - 1) * currentPageSize;
  req.paginationInfo = { skipPages, currentPageSize };
  req.searchQuery = query;
  next();
};

module.exports = prepareSearchedUsers;

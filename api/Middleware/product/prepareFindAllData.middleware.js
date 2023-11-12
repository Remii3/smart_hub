const prepareFindAllData = async (req, res, next) => {
  const {
    currentPageSize = 10,
    currentPage,
    category,
    authorId,
    creatorId,
    showSold,
  } = req.query;

  const query = {};

  if (category) {
    query.categories = category;
  }

  if (authorId) {
    query.authors = authorId;
  }

  if (creatorId) {
    query['creatorData._id'] = creatorId;
  }

  if (!showSold) {
    query.sold = false;
    query.quantity = { $gt: 0 };
  }

  const skipPages = (currentPage - 1) * currentPageSize;
  req.preparedData = query;
  req.pageData = { currentPage, skipPages, currentPageSize };
  next();
};

module.exports = prepareFindAllData;

const checkSortMethod = (req, res, next) => {
  const { sortOption } = req.query;
  const sortMethod = {};
  if (sortOption) {
    switch (sortOption) {
      case 'Date, ASC':
        sortMethod.createdAt = 1;
        break;
      case 'Date, DESC':
        sortMethod.createdAt = -1;
        break;
      case 'Title, ASC':
        sortMethod.title = 1;
        break;
      case 'Title, DESC':
        sortMethod.title = -1;
        break;
      case 'Price, DESC':
        sortMethod['price.value'] = -1;
        break;
      case 'Price, ASC':
        sortMethod['price.value'] = 1;
        break;
      case 'latest':
        sortMethod.createdAt = -1;
        break;
      case 'top_rated':
        sortMethod['voting.quantity.likes'] = -1;
        break;
    }
  } else {
    sortMethod.createdAt = -1;
  }
  req.sortMethod = sortMethod;
  next();
};

module.exports = checkSortMethod;

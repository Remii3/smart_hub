const checkSortMethod = (req, res, next) => {
  const { sortOption } = req.query;
  const sortMethod = {};
  if (sortOption) {
    switch (sortOption) {
      case "Date, ASC":
        sortMethod.created_at = 1;
        break;
      case "Date, DESC":
        sortMethod.created_at = -1;
        break;
      case "Title, ASC":
        sortMethod.title = 1;
        break;
      case "Title, DESC":
        sortMethod.title = -1;
        break;
      case "Price, DESC":
        sortMethod["shop_info.price"] = -1;
        break;
      case "Price, ASC":
        sortMethod["shop_info.price"] = 1;
        break;
    }
  } else {
    sortMethod.created_at = -1;
  }
  req.sortMethod = sortMethod;
  next();
};

module.exports = checkSortMethod;

const prepareNewsSearch = (req, res, next) => {
  const { special, limit } = req.query;

  const preparedData = {};
  const searchOptions = {};

  if (special) {
    searchOptions.special = special;
  }

  if (limit) {
    searchOptions.limit = limit;
  }

  req.preparedData = preparedData;
  req.searchOptions = searchOptions;
  next();
};
module.exports = prepareNewsSearch;

const prepareNewsSearch = (req, res, next) => {
  const { special, limit, filtersData } = req.query;

  const searchQuery = {};
  const searchLimit = {};

  // if (special) {
  //   searchOptions.special = special;
  // }

  if (filtersData && filtersData.searchedPhrase) {
    searchQuery['$search'] = {
      autocomplete: { query: `${filtersData.searchedPhrase}`, path: 'title' },
    };
  }

  if (limit) {
    searchLimit['$limit'] = limit;
  }

  req.searchQuery = searchQuery;
  req.searchLimit = searchLimit;
  next();
};
module.exports = prepareNewsSearch;

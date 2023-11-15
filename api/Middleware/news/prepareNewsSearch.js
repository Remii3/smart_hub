const prepareNewsSearch = (req, res, next) => {
  let { limit, searchQuery, currentPage } = req.query;

  const searchPipeline = [];
  const searchCopyPipeline = [];

  const page = Number(currentPage) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (page - 1) * pageSize;

  if (searchQuery === 'all') {
    searchQuery = '';
    searchCopyPipeline.push({
      $sort: { createdAt: -1 },
    });
  }

  if (searchQuery) {
    searchPipeline.push({
      $search: {
        index: 'titleSearchIndex',
        text: {
          query: searchQuery,
          path: {
            wildcard: '*',
          },
        },
      },
    });
    searchCopyPipeline.push({
      $search: {
        index: 'titleSearchIndex',
        text: {
          query: searchQuery,
          path: {
            wildcard: '*',
          },
        },
      },
    });
  }

  searchCopyPipeline.push({
    $skip: skip,
  });

  searchCopyPipeline.push({
    $limit: Number(limit),
  });

  searchPipeline.push({
    $count: 'totalDocuments',
  });

  req.searchPipeline = searchPipeline;
  req.searchCopyPipeline = searchCopyPipeline;
  next();
};
module.exports = prepareNewsSearch;

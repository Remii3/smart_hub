const Category = require('../../Models/category');

const prepareFindOne = async (req, res, next) => {
  const { category, minPrice, maxPrice, authorIds, creatorId } = req.query;
  const query = {};

  if (category) {
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    const categoryData = await Category.findOne({
      label: categoryLabel,
    });
    if (!categoryData) {
      return res.status(422).json({
        message: 'Invalid category',
        error: 'This category in not in database: ' + category,
      });
    }
    query.categories = categoryData._id;
  }

  if (minPrice) {
    query['price.value'] = { $gte: minPrice };
  }
  if (maxPrice) {
    query['price.value'] = { $lte: Number(maxPrice) };
  }
  if (authorIds) {
    query['authors'] = { $in: authorIds };
  }

  if (creatorId) {
    query['creatorData._id'] = creatorId;
  }
  req.queryData = query;
  next();
};

module.exports = prepareFindOne;

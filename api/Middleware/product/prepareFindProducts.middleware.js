const { default: mongoose } = require('mongoose');
const Category = require('../../Models/category');

const prepareFindProducts = async (req, res, next) => {
  const {
    category,
    minPrice,
    maxPrice,
    authorId,
    authorIds,
    creatorId,
    showSold,
    showDeleted,
    marketplace,
  } = req.query;
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
  if (marketplace) {
    query.marketplace = marketplace;
  }
  if (authorId) {
    query.authors = new mongoose.Types.ObjectId(authorId);
  }

  if (authorIds) {
    query.authors = authorIds.map(
      author => new mongoose.Types.ObjectId(author),
    );
  }

  if (creatorId) {
    query['creatorData._id'] = new mongoose.Types.ObjectId(creatorId);
  }

  if (!showSold) {
    query.sold = false;
    query.quantity = { $gt: 0 };
  }

  if (!showDeleted) {
    query.deleted = false;
  }

  req.queryData = query;
  next();
};

module.exports = prepareFindProducts;

const Category = require('../../Models/category');

// 64936919bce5bcdfbc73e1bf
// new ObjectId("64936919bce5bcdfbc73e1bf")
const searchAllCollections = async (req, res, next) => {
  const { category, minPrice, maxPrice, authorIds, creatorId } = req.query;
  const query = {};
  let test = '';
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
    test = categoryData;
    query.products = {
      $elemMatch: { categories: categoryData._id },
    };
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
  req.category = test;
  req.searchQuery = query;
  next();
};

module.exports = searchAllCollections;

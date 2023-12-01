const Category = require('../../Models/category');
const mongoose = require('mongoose');

const prepareUpdateProduct = async (req, res, next) => {
  const {
    title,
    description,
    shortDescription,
    quantity,
    imgs,
    categories,
    authors,
    marketplace,
    price,
  } = req.body;
  const preparedData = {};

  if (title) {
    preparedData.title = title;
  }

  if (req.body.description !== undefined) {
    preparedData.description = description;
  }

  if (req.body.shortDescription !== undefined) {
    preparedData.shortDescription = shortDescription;
  }

  if (quantity) {
    preparedData.quantity = Number(quantity);
  }

  if (imgs) {
    preparedData.imgs = imgs;
  }

  if (categories) {
    for (let i = 0; i < categories.length; i++) {
      const exists = await Category.findOne({
        label: new RegExp(categories[i].label, 'i'),
      });
      if (!exists) {
        const newCategoryId = new mongoose.Types.ObjectId();

        await Category.create({
          _id: newCategoryId,
          label: categories[i].label,
          value: categories[i].value,
        });
        categories[i] = newCategoryId;
      }
    }
    preparedData.categories = categories;
  }

  if (authors) {
    preparedData.authors = authors;
  }

  if (marketplace) {
    preparedData.marketplace = marketplace;
  }

  if (price) {
    preparedData['price.value'] = Number(price);
  }

  req.preparedData = preparedData;
  next();
};

module.exports = prepareUpdateProduct;

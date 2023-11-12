const prepareUpdate = (req, res, next) => {
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

  if (description) {
    preparedData.description = description;
  }

  if (shortDescription) {
    preparedData.shortDescription = shortDescription;
  }

  if (quantity) {
    preparedData.quantity = Number(quantity);
  }

  if (imgs) {
    preparedData.imgs = imgs;
  }

  if (categories) {
    preparedData.categories = categories;
  }

  if (authors) {
    preparedData.authors = authors;
  }

  if (marketplace) {
    preparedData.marketplace = marketplace;
  }

  if (price) {
    preparedData.price = Number(price);
  }

  req.preparedData = preparedData;
  next();
};

module.exports = prepareUpdate;

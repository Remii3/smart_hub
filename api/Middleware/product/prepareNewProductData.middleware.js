const prepareNewProductData = (req, res, next) => {
  const {
    creatorData,
    title,
    description,
    shortDescription,
    quantity,
    imgs,
    price,
    marketplace,
    categories,
    authors,
  } = req.body;
  const preparedData = {};
  if (creatorData) {
    preparedData.creatorData = {
      _id: creatorData._id,
      pseudonim: creatorData.pseudonim,
    };
  }

  if (title) {
    preparedData.title = title;
  }
  if (categories && categories.length > 0) {
    preparedData.categories = categories;
  }
  if (authors && authors.length > 0) {
    preparedData.authors = authors;
  }

  if (marketplace) {
    preparedData.marketplace = marketplace;
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
    preparedData.price = { value: Number(price) };
  }
  req.productData = preparedData;
  next();
};

module.exports = prepareNewProductData;

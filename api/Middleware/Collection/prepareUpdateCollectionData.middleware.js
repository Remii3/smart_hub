const prepareUpdateCollectionData = (req, res, next) => {
  const { title, description, shortDescription, products, quantity, price } =
    req.body;
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
  if (products) {
    preparedData.products = products;
  }
  if (price) {
    preparedData.price = { value: Number(price) };
  }

  req.collectionData = preparedData;
  next();
};

module.exports = prepareUpdateCollectionData;

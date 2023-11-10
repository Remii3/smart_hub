const prepareNewCollectionData = (req, res, next) => {
  const { creatorData, title, description, shortDescription, quantity, price } =
    req.body;
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

  if (description) {
    preparedData.description = description;
  }

  if (shortDescription) {
    preparedData.shortDescription = shortDescription;
  }

  if (quantity) {
    preparedData.quantity = Number(quantity);
  }

  if (price) {
    preparedData.price = { value: Number(price) };
  }

  req.collectionData = preparedData;
  next();
};

module.exports = prepareNewCollectionData;

const preparePostCartItem = (req, res, next) => {
  const { userId, productId } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'User id is required!' });
  }

  if (!productId) {
    return res.status(422).json({ message: 'Product id is required!' });
  }

  const preparedData = {
    userId,
    productId,
  };

  req.preparedData = preparedData;
  next();
};
module.exports = preparePostCartItem;

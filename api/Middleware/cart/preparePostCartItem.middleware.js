const preparePostCartItem = (req, res, next) => {
  const { userId, productId } = req.body;
  const cookie = req.cookies.token || req.cookies.guestToken;
  let id = userId || cookie;

  if (!productId) {
    return res.status(422).json({ message: 'Product id is required!' });
  }
  console.log('cookie id', id);
  const preparedData = {
    userId: id,
    productId,
  };

  req.preparedData = preparedData;
  next();
};
module.exports = preparePostCartItem;

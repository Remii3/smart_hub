const Cart = require('../Models/cart');
const Product = require('../Models/product');
const calculateOrderAmount = require('../helpers/calculateOrderAmount');

const stripe = require('stripe')(
  'sk_test_51NDZ0zHqBBlAtOOFMShIrv9OwdfC6958wOWqZa1X59kOeyY4hNtZ80ANZ6WYv67v4a8FOFguc04SCV84QKEf6nFf005r6tKBO6',
);

const addToCart = async (req, res) => {
  const { cartId, productId, productQuantity } = req.body;
  if (!cartId) res.status(422).json({ message: 'Cart id is required!' });
  if (!productId) res.status(422).json({ message: 'Product id is required!' });
  if (!productQuantity)
    res.status(422).json({ message: 'Product quantity is required!' });

  try {
    const productExists = await Cart.findOne({
      _id: cartId,
      'products._id': productId,
    });
    if (productExists) {
      try {
        await Cart.updateOne(
          { _id: cartId, 'products._id': productId },
          {
            $inc: {
              'products.$.inCartQuantity': productQuantity,
            },
          },
        );
        res.status(200).json({ message: 'Success' });
      } catch (err) {
        res.status(422).json({
          message: 'Something went wrong with incrementing product',
        });
      }
    } else {
      try {
        await Cart.updateOne(
          { _id: cartId },
          {
            $push: {
              products: { _id: productId, inCartQuantity: productQuantity },
            },
          },
          { upsert: true },
        );
        res.status(200).json({ message: 'Success' });
      } catch (err) {
        res
          .status(422)
          .json({ message: 'Something went wrong with adding new product' });
      }
    }
  } catch (err) {
    res
      .status(422)
      .json({ message: 'Something went wrong with finding the cart' });
  }
};

const removeFromCart = async (req, res) => {
  const { cartId, productId } = req.body;

  if (!cartId) res.status(401).json({ message: 'Cart id is required!' });
  if (!productId) res.status(401).json({ message: 'Product id is required!' });

  try {
    await Cart.updateOne(
      { _id: cartId },
      { $pull: { products: { _id: productId } } },
    );
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res
      .status(422)
      .json({ message: 'Something went wrong with removing product' });
  }
};

const getCart = async (req, res) => {
  const { cartId } = req.query;
  if (!cartId) return res.status(422).json({ message: 'Cart id is required!' });

  try {
    const cartData = await Cart.findOne({ _id: cartId });
    if (cartData) {
      const products = cartData.products;
      const productsData = [];

      for (const item of products) {
        try {
          let totalPrice = 0;
          const contents = await Product.findOne({ _id: item._id });
          totalPrice += contents.price * item.inCartQuantity;
          productsData.push({
            productData: contents,
            inCartQuantity: item.inCartQuantity,
            totalPrice,
          });
        } catch (err) {
          res.status(422).json({ message: 'No product found', products: null });
        }
      }
      res.status(200).json({ message: 'Success', products: productsData });
    } else {
      res.status(200).json({ message: 'No products', products: null });
    }
  } catch (err) {
    res
      .status(422)
      .json({ message: 'Something went wrong with fetching cart data' });
  }
};

const cartItemIncrement = async (req, res) => {
  const { cartId, productId } = req.body;
  if (!cartId) res.status(422).json({ message: 'Cart id is required!' });

  if (!productId) res.status(422).json({ message: 'Product id is required!' });

  try {
    await Cart.updateOne(
      { _id: cartId, 'products._id': productId },
      { $inc: { 'products.$.inCartQuantity': 1 } },
    );

    res.status(200).json({ message: 'Successfuly updated data' });
  } catch (err) {
    res
      .status(422)
      .json({ message: 'Something went wrong with updating product data' });
  }
};

const cartItemDecrement = async (req, res) => {
  const { cartId, productId } = req.body;
  if (!cartId) res.status(422).json({ message: 'Cart id is required!' });

  if (!productId) res.status(422).json({ message: 'Product id is required!' });

  try {
    await Cart.updateOne(
      { _id: cartId, 'products._id': productId },
      { $inc: { 'products.$.inCartQuantity': -1 } },
    );

    res.status(200).json({ message: 'Successfuly updated data' });
  } catch (err) {
    res
      .status(422)
      .json({ message: 'Something went wrong with updating product data' });
  }
};

const initiatePayment = async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  cartItemIncrement,
  cartItemDecrement,
  initiatePayment,
};

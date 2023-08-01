const Cart = require('../Models/cart');
const Product = require('../Models/product');
const calculateOrderAmount = require('../helpers/calculateOrderAmount');
const prepareProductObject = require('../helpers/prepareProductObject');

const stripe = require('stripe')(
  'sk_test_51NDZ0zHqBBlAtOOFMShIrv9OwdfC6958wOWqZa1X59kOeyY4hNtZ80ANZ6WYv67v4a8FOFguc04SCV84QKEf6nFf005r6tKBO6',
);

const addToCart = async (req, res) => {
  const { userId, productId, productQuantity } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'User id is required!' });
  }
  if (!productId) {
    return res.status(422).json({ message: 'Product id is required!' });
  }
  if (!productQuantity) {
    return res.status(422).json({ message: 'Product quantity is required!' });
  }

  try {
    const cart = await Cart.findOne({ user_id: userId });
    if (cart) {
      const existingItem = await Cart.findOne({
        user_id: userId,
        'products._id': productId,
      });
      if (existingItem) {
        await Cart.updateOne(
          { user_id: userId, 'products._id': productId },
          { $inc: { 'products.$.quantity': productQuantity } },
        );
      } else {
        await Cart.updateOne(
          { user_id: userId },
          {
            $push: {
              products: {
                _id: productId,
                quantity: productQuantity,
              },
            },
          },
        );
      }
    } else {
      await Cart.create({
        user_id: userId,
        products: [{ _id: productId, quantity: productQuantity }],
      });
    }
    res.status(201).json({ message: 'Successfully added' });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      err,
    });
  }
};

const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId) res.status(422).json({ message: 'User id is required!' });
  if (!productId) res.status(422).json({ message: 'Product id is required!' });

  try {
    if (productId === 'all') {
      await Cart.updateOne({ userId }, { $pull: { items: {} } });
    } else {
      await Cart.updateOne(
        { userId },
        { $pull: { items: { _id: productId } } },
      );
    }
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong with removing product',
      err,
    });
  }
};

const getCart = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(422).json({ message: 'User id is required!' });

  try {
    const cartData = await Cart.findOne({ user_id: userId });
    let cartPrice = 0;

    if (cartData) {
      console.log(cartData);
      const products = cartData.products;
      const productsData = [];

      for (const product of products) {
        let totalPrice = 0;
        const contents = await Product.findOne({ _id: product._id });
        if (contents) {
          totalPrice += contents.shop_info.price * product.quantity;
          const preparedProduct = prepareProductObject(contents);
          productsData.push({
            productData: preparedProduct,
            inCartQuantity: product.quantity,
            totalPrice: totalPrice,
          });
        } else {
          await Cart.updateOne(
            { user_id: userId, 'products._id': product._id },
            { $pull: { products: { _id: product._id } } },
          );
        }
      }

      for (const product of productsData) {
        cartPrice += product.totalPrice;
      }

      cartPrice = cartPrice.toFixed(2);

      cartPrice = `€${cartPrice}`;

      res.status(200).json({ products: productsData, cartPrice });
    } else {
      cartPrice = '€0';
      res.status(200).json({ products: [], cartPrice });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong with fetching cart data',
      products: null,
    });
  }
};

const cartItemIncrement = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'User id is required!' });
  }

  if (!productId) {
    return res.status(422).json({ message: 'Product id is required!' });
  }
  try {
    await Cart.updateOne(
      { userId, 'items._id': productId },
      { $inc: { 'items.$.quantity': 1 } },
    );

    res.status(200).json({ message: 'Sduccessfuly updated data' });
  } catch (err) {
    res.status(500).json({
      message: 'Cart or product was not found',
      err,
    });
  }
};

const cartItemDecrement = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'User id is required!' });
  }

  if (!productId) {
    return res.status(422).json({ message: 'Product id is required!' });
  }

  try {
    await Cart.updateOne(
      { userId, 'items._id': productId },
      { $inc: { 'items.$.quantity': -1 } },
    );

    res.status(200).json({ message: 'Successfuly updated data' });
  } catch (err) {
    res.status(500).json({
      message: 'Cart or product was not found',
      err,
    });
  }
};

const initiatePayment = async (req, res) => {
  const { items } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to initiate payment', err });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  cartItemIncrement,
  cartItemDecrement,
  initiatePayment,
};

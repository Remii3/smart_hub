const Cart = require('../Models/cart');
const { Product } = require('../Models/product');
const calculateOrderAmount = require('../helpers/calculate/calculateOrderAmount');
const cashFormatter = require('../helpers/cashFormatter');
const reverseCashFormatter = require('../helpers/reverseCashFormatter');

const stripe = require('stripe')(
  'sk_test_51NDZ0zHqBBlAtOOFMShIrv9OwdfC6958wOWqZa1X59kOeyY4hNtZ80ANZ6WYv67v4a8FOFguc04SCV84QKEf6nFf005r6tKBO6',
);

const getAllCartItems = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(422).json({ message: 'User id is required!' });
  }

  const preparedData = {
    products: [],
    cartPrice: 0,
    additionalData: { discount: 0 },
  };

  try {
    const cartData = await Cart.findOne({
      userId,
    }).lean();

    if (!cartData) {
      await Cart.create({
        userId: userId,
      });
      return res.status(200).json({
        data: {
          products: preparedData.products,
          cartPrice: `${cashFormatter({ number: preparedData.cartPrice })}`,
          additionalData: {
            discount: `${cashFormatter({
              number: preparedData.additionalData.discount,
            })}`,
          },
        },
      });
    }

    for (let i = 0; i < cartData.products.length; i++) {
      const product = cartData.products[i];
      const productData = await Product.findOne(
        {
          _id: product._id,
          deleted: false,
          quantity: { $gt: 0 },
          sold: false,
        },
        {
          imgs: 1,
          marketplace: 1,
          price: 1,
          title: 1,
          quantity: 1,
        },
      ).lean();

      if (!productData) {
        await Cart.updateOne(
          { userId, 'products._id': product._id },
          { $pull: { products: { _id: product._id } } },
        );
      }

      const dataCopy = { ...productData, price: { ...productData.price } };
      preparedData.products.push({
        productData: dataCopy,
        inCartQuantity: product.quantity,
        totalPrice: `${cashFormatter({
          number: dataCopy.price.value * product.quantity,
        })}`,
      });
      preparedData.cartPrice += dataCopy.price.value * product.quantity;
    }

    preparedData.cartPrice = `${cashFormatter({
      number: preparedData.cartPrice,
    })}`;

    preparedData.additionalData = {
      discount: `${cashFormatter({
        number: preparedData.additionalData.discount,
      })}`,
    };
    return res
      .status(200)
      .json({ data: preparedData, message: 'Successfully fetched cart.' });
  } catch (err) {
    return res.status(500).json({
      message: 'We failed getting your cart.',
      error: err.message,
    });
  }
};

const addItemToCart = async (req, res) => {
  const { productQuantity } = req.body;
  const { userId, productId } = req.preparedData;

  if (!productQuantity) {
    return res.status(422).json({ message: 'Product quantity is required!' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      await Cart.create({
        userId: userId,
        products: [{ _id: productId, quantity: productQuantity }],
      });
      return res
        .status(201)
        .json({ message: 'Successfully added product to the cart.' });
    }

    const existingItem = await Cart.findOne({
      userId,
      'products._id': productId,
    });

    if (existingItem) {
      await Cart.updateOne(
        { userId, 'products._id': productId },
        { $inc: { 'products.$.quantity': productQuantity } },
      );
      return res
        .status(201)
        .json({ message: 'Successfully added product to the cart.' });
    }

    await Cart.updateOne(
      { userId },
      {
        $push: {
          products: {
            _id: productId,
            quantity: productQuantity,
          },
        },
      },
    );
    return res
      .status(201)
      .json({ message: `Successfully added product to the cart.` });
  } catch (err) {
    return res.status(500).json({
      message: `We failed adding product to the cart.`,
      error: err.message,
    });
  }
};

const removeItemFromCart = async (req, res) => {
  const { userId, productId } = req.preparedData;

  try {
    if (productId === 'all') {
      await Cart.updateOne({ userId }, { $set: { products: [] } });
    } else {
      await Cart.updateOne(
        { userId },
        { $pull: { products: { _id: productId } } },
      );
    }
    return res.status(200).json({ message: 'Successfully removed your item.' });
  } catch (err) {
    const errorMessage =
      productId === 'all'
        ? "We couldn't remove your items from the cart."
        : "We couldn't remove your item from the cart.";
    return res.status(500).json({
      message: errorMessage,
      error: err.message,
    });
  }
};

const cartItemIncrement = async (req, res) => {
  const { userId, productId } = req.preparedData;

  try {
    await Cart.updateOne(
      { userId: userId, 'products._id': productId },
      { $inc: { 'products.$.quantity': 1 } },
    );

    return res
      .status(200)
      .json({ message: 'Successfuly added more products.' });
  } catch (err) {
    return res.status(500).json({
      message: 'We failed adding more products to the cart.',
      error: err.message,
    });
  }
};

const cartItemDecrement = async (req, res) => {
  const { userId, productId } = req.preparedData;

  try {
    await Cart.updateOne(
      { userId: userId, 'products._id': productId },
      { $inc: { 'products.$.quantity': -1 } },
    );

    return res
      .status(200)
      .json({ message: 'Successfuly removed item from the cart.' });
  } catch (err) {
    return res.status(500).json({
      message: 'We failed removing item from your cart.',
      error: err.message,
    });
  }
};

const initiatePayment = async (req, res) => {
  const { items } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to initiate payment', err: err.message });
  }
};

module.exports = {
  getAllCartItems,
  addItemToCart,
  removeItemFromCart,
  cartItemIncrement,
  cartItemDecrement,
  initiatePayment,
};

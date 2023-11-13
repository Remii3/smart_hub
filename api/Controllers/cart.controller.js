const Cart = require('../Models/cart');
const Product = require('../Models/product');
const Collection = require('../Models/collection');
const calculateOrderAmount = require('../helpers/calculate/calculateOrderAmount');
const cashFormatter = require('../helpers/cashFormatter');

const stripe = require('stripe')(
  'sk_test_51NDZ0zHqBBlAtOOFMShIrv9OwdfC6958wOWqZa1X59kOeyY4hNtZ80ANZ6WYv67v4a8FOFguc04SCV84QKEf6nFf005r6tKBO6',
);

const addItemToCart = async (req, res) => {
  const { userId, productId, productQuantity, type } = req.body;

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

    if (!cart) {
      await Cart.create({
        user_id: userId,
        products: [{ _id: productId, quantity: productQuantity }],
      });
      return res.status(201).json({ message: 'Successfully added' });
    }

    const existingItem = await Cart.findOne({
      user_id: userId,
      $or: [{ 'products._id': productId }, { 'collections._id': productId }],
    });

    if (existingItem) {
      switch (type) {
        case 'shop': {
          await Cart.updateOne(
            { user_id: userId, 'products._id': productId },
            { $inc: { 'products.$.quantity': productQuantity } },
          );
          break;
        }
        case 'collection': {
          await Cart.updateOne(
            { user_id: userId, 'collections._id': productId },
            { $inc: { 'collections.$.quantity': productQuantity } },
          );
          break;
        }
      }
      return res.status(201).json({ message: 'Successfully added' });
    }

    switch (type) {
      case 'shop': {
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
        break;
      }
      case 'collection': {
        await Cart.updateOne(
          { user_id: userId },
          {
            $push: {
              collections: {
                _id: productId,
                quantity: productQuantity,
              },
            },
          },
        );
        break;
      }
    }
    return res.status(201).json({ message: 'Successfully added' });
  } catch (err) {
    return res.status(500).json({
      message: `Failed adding ${type} to cart.`,
      error: err.message,
    });
  }
};

const removeItemFromCart = async (req, res) => {
  const { userId, productId, type } = req.body;

  if (!userId) {
    return res.status(422).json({ message: 'User id is required!' });
  }

  if (!productId) {
    return res.status(422).json({ message: 'Product id is required!' });
  }

  try {
    if (productId === 'all') {
      await Cart.updateOne({ user_id: userId }, { $set: { products: [] } });
    } else {
      switch (type) {
        case 'shop': {
          await Cart.updateOne(
            { user_id: userId },
            { $pull: { products: { _id: productId } } },
          );
          break;
        }
        case 'collection': {
          await Cart.updateOne(
            { user_id: userId },
            { $pull: { collections: { _id: productId } } },
          );
          break;
        }
      }
    }
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    const errorMessage =
      productId === 'all'
        ? "We couldn't remove your items from the cart"
        : "We couldn't remove your item from the cart";
    return res.status(500).json({
      message: errorMessage,
      error: err.message,
    });
  }
};

const getAllCartItems = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(422).json({ message: "User id is required!" });
  }
  try {
    const productsData = [];
    let cartPrice = 0;

    const cartData = await Cart.findOne({
      user_id: userId,
    }).lean();

    if (!cartData) {
      cartPrice = `${cashFormatter({ number: 0 })}`;

      return res
        .status(200)
        .json({ data: { products: productsData, cartPrice } });
    }
    const products = cartData.products;
    const collections = cartData.collections;

    for (let i = 0; i < products.length; i++) {
      const productData = await Product.findOne(
        {
          _id: products[i]._id,
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
        }
      ).lean();

      if (productData) {
        const dataCopy = { ...productData, price: { ...productData.price } };
        dataCopy.price.value = `${cashFormatter({
          number: dataCopy.price.value,
        })}`;
        productsData.push({
          productData: dataCopy,
          inCartQuantity: products[i].quantity,
          totalPrice: productData.price.value * products[i].quantity,
        });
        cartPrice += productData.price.value * products[i].quantity;
      } else {
        await Cart.updateOne(
          { user_id: userId, "products._id": products[i]._id },
          { $pull: { products: { _id: products[i]._id } } }
        );
      }
    }
    for (let i = 0; i < collections.length; i++) {
      const collectionData = await Collection.findOne(
        {
          _id: collections[i]._id,
          deleted: false,
          quantity: { $gt: 0 },
          sold: false,
        },
        {
          price: 1,
          title: 1,
          marketplace: 1,
          quantity: 1,
        }
      ).lean();

      if (collectionData) {
        const dataCopy = {
          ...collectionData,
          price: { ...collectionData.price },
        };
        dataCopy.price.value = `${cashFormatter({
          number: dataCopy.price.value,
        })}`;
        productsData.push({
          productData: dataCopy,
          inCartQuantity: collections[i].quantity,
          totalPrice: collectionData.price.value * collections[i].quantity,
        });
        cartPrice += collectionData.price.value * collections[i].quantity;
      } else {
        await Cart.updateOne(
          { user_id: userId, "products._id": collections[i]._id },
          { $pull: { collections: { _id: collections[i]._id } } }
        );
      }
    }
    cartPrice = `${cashFormatter({ number: cartPrice })}`;
    return res
      .status(200)
      .json({ data: { products: productsData, cartPrice } });
  } catch (err) {
    return res.status(500).json({
      message: "We couldn't update your cart data",
      error: err.message,
    });
  }
};

const cartItemIncrement = async (req, res) => {
  const { userId, productId, type } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'User id is required!' });
  }

  if (!productId) {
    return res.status(422).json({ message: 'Product id is required!' });
  }

  try {
    switch (type) {
      case 'shop': {
        await Cart.updateOne(
          { user_id: userId, 'products._id': productId },
          { $inc: { 'products.$.quantity': 1 } },
        );
        break;
      }
      case 'collection': {
        await Cart.updateOne(
          { user_id: userId, 'collections._id': productId },
          { $inc: { 'collections.$.quantity': 1 } },
        );
        break;
      }
    }

    return res.status(200).json({ message: 'Successfuly updated data' });
  } catch (err) {
    return res.status(500).json({
      message: 'Cart or product was not found',
      error: err.message,
    });
  }
};

const cartItemDecrement = async (req, res) => {
  const { userId, productId, type } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'User id is required!' });
  }

  if (!productId) {
    return res.status(422).json({ message: 'Product id is required!' });
  }

  try {
    switch (type) {
      case 'shop': {
        await Cart.updateOne(
          { user_id: userId, 'products._id': productId },
          { $inc: { 'products.$.quantity': -1 } },
        );
      }
      case 'collection': {
        await Cart.updateOne(
          { user_id: userId, 'collections._id': productId },
          { $inc: { 'collections.$.quantity': -1 } },
        );
      }
    }

    return res.status(200).json({ message: 'Successfuly updated data' });
  } catch (err) {
    return res.status(500).json({
      message: 'Cart or product was not found',
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
  addItemToCart,
  removeItemFromCart,
  getAllCartItems,
  cartItemIncrement,
  cartItemDecrement,
  initiatePayment,
};

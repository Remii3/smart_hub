const Cart = require('../Models/cart');
const Product = require('../Models/product');

const addToCart = async (req, res) => {
    const { userId, productId, productQuantity } = req.body;
    if (!userId) {
        return res.status(422).json({ message: 'User id is required!' });
    }
    if (!productId) {
        return res.status(422).json({ message: 'Product id is required!' });
    }
    if (!productQuantity) {
        return res
            .status(422)
            .json({ message: 'Product quantity is required!' });
    }

    try {
        const product = await Product.findById({ _id: productId });
        if (!product) {
            return res.status(404).json({ message: 'No product found' });
        }
        const cart = await Cart.findOne({ userId });
        if (cart) {
            const existingItem = await Cart.findOne({
                userId,
                'items._id': productId,
            });
            if (existingItem) {
                await Cart.updateOne(
                    { userId, 'items._id': productId },
                    { $inc: { 'items.$.quantity': productQuantity } },
                );
            } else {
                await Cart.updateOne(
                    { userId },
                    {
                        $push: {
                            items: {
                                _id: productId,
                                quantity: productQuantity,
                            },
                        },
                    },
                );
            }
            await cart.save();
        } else {
            await Cart.create({
                userId,
                items: [{ _id: productId, quantity: productQuantity }],
            });
        }
        res.status(201).json({ message: 'Successfully added' });
    } catch (err) {
        res.status(500).json({
            message: 'Server error',
        });
    }
};

const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId) res.status(422).json({ message: 'User id is required!' });
    if (!productId)
        res.status(422).json({ message: 'Product id is required!' });

    try {
        await Cart.updateOne(
            { userId },
            { $pull: { items: { _id: productId } } },
        );
        res.status(200).json({ message: 'Success' });
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong with removing product',
        });
    }
};

const getCart = async (req, res) => {
    const { userId } = req.query;
    if (!userId)
        return res.status(422).json({ message: 'User id is required!' });

    try {
        const cartData = await Cart.findOne({ userId });
        if (cartData) {
            const items = cartData.items;
            const productsData = [];

            for (const item of items) {
                try {
                    let totalPrice = 0;
                    const contents = await Product.findOne({ _id: item._id });
                    totalPrice += contents.price * item.inCartQuantity;
                    productsData.push({
                        productData: contents,
                        inCartQuantity: item.quantity,
                        totalPrice,
                    });
                } catch (err) {
                    res.status(500).json({ message: 'No product found' });
                }
            }
            res.status(200).json({
                message: 'Success',
                products: productsData,
            });
        } else {
            res.status(200).json({ message: 'No products' });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong with fetching cart data',
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
        });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCart,
    cartItemIncrement,
    cartItemDecrement,
};

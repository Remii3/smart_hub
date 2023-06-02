const Order = require('../Models/order');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            error: 'Failed fetching orders',
        });
    }
};

const addOrder = async (req, res) => {
    try {
        const { user, items } = req.body;
        const totalAmount = 0;

        const order = new Order({ user, items, totalAmount });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed adding new order' });
    }
};

module.exports = { getOrders, addOrder };

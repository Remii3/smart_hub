const Category = require('../Models/category');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Failed fatching categories' });
    }
};

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: 'Failed adding new category' });
    }
};

module.exports = { getAllCategories, addCategory };

const Category = require('../Models/category');

const allCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed fatching categories', err });
  }
};

const oneCategory = async (req, res) => {};

const addCategory = async (req, res) => {
  try {
    const { label, value, description } = req.body;

    await Category.insertOne({ label, value, description });
    res.status(201).json('success');
  } catch (err) {
    res.status(500).json({ error: 'Failed adding new category', err });
  }
};

module.exports = { allCategories, oneCategory, addCategory };

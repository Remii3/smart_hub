const Category = require('../Models/category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ data: categories });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fatching categories', error: err.message });
  }
};

const addOneCategory = async (req, res) => {
  try {
    const { label, value, description } = req.body;

    await Category.insertOne({ label, value, description });
    return res.status(201).json({ message: 'Success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed adding new category', error: err.message });
  }
};

module.exports = { getAllCategories, addOneCategory };

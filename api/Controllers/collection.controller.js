const { default: mongoose } = require('mongoose');
const Collection = require('../Models/collection');
const cashFormatter = require('../helpers/cashFormatter.js');

const findAllCollections = async (req, res) => {
  const { category, authorId, limit = 10 } = req.query;
  const sortMethod = req.sortMethod;

  const query = {};

  if (category) {
    query.categories = category;
  }

  if (authorId) {
    query.authors = authorId;
  }

  try {
    const collectionData = await Collection.find(query, {
      _id: 1,
      title: 1,
      price: 1,
      rating: 1,
      imgs: 1,
      shortDescription: 1,
    })
      .sort(sortMethod)
      .limit(limit)
      .lean();

    const preparedData = collectionData.map(collection => ({
      ...collection,
      price: {
        ...collection.price,
        value: `${cashFormatter({
          number: collection.price.value,
        })}`,
      },
    }));
    return res.status(200).json({ data: preparedData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching comments', error: err.message });
  }
};

const findOneCollection = async (req, res) => {
  const { _id } = req.query;
  try {
    const collectionData = await Collection.findOne(
      { _id },
      {
        _id: 1,
        creatorData: 1,
        title: 1,
        description: 1,
        shortDescription: 1,
        imgs: 1,
        categories: 1,
        authors: 1,
        rating: 1,
        price: 1,
        quantity: 1,
        created_at: 1,
        updated_at: 1,
        products: 1,
        comments: 1,
      },
    ).lean();

    const preparedData = {
      ...collectionData,
      price: {
        ...collectionData.price,
        value: `${cashFormatter({
          number: collectionData.price.value,
        })}`,
      },
    };
    return res.status(200).json({ data: preparedData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching comments', error: err.message });
  }
};

const findSearchedCollections = async (req, res) => {};

const createOneCollection = async (req, res) => {
  const preparedData = req.collectionData;
  try {
    const _id = new mongoose.Types.ObjectId();

    await Collection.create({ _id, ...preparedData });

    return res
      .status(201)
      .json({ message: 'Succesfully added new product', id: _id });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching comments', error: err.message });
  }
};

const updateOneCollection = async (req, res) => {};

const deleteOneCollection = async (req, res) => {};

module.exports = {
  findAllCollections,
  findOneCollection,
  findSearchedCollections,
  createOneCollection,
  updateOneCollection,
  deleteOneCollection,
};

const { default: mongoose } = require('mongoose');
const Collection = require('../Models/collection');
const cashFormatter = require('../helpers/cashFormatter.js');

const findAllCollections = async (req, res) => {
  const { category, authorId, creatorId, limit = 10 } = req.query;
  const sortMethod = req.sortMethod;
  const query = {};

  if (category) {
    query.categories = category;
  }

  if (authorId) {
    query.authors = authorId;
  }

  if (creatorId) {
    query['creatorData._id'] = creatorId;
  }

  try {
    const collectionData = await Collection.find(
      { ...query, quantity: { $gt: 0 }, deleted: false, sold: false },
      {
        _id: 1,
        title: 1,
        price: 1,
        shortDescription: 1,
        products: 1,
        rating: 1,
      },
    )
      .populate('products')
      .sort(sortMethod)
      .limit(limit)
      .lean();
    const preparedData = [...collectionData];
    for (let i = 0; i < collectionData.length; i++) {
      const imgs = [];
      for (let j = 0; j < collectionData[i].products.length; j++) {
        if (collectionData[i].products[j].imgs.length > 0) {
          imgs.push(collectionData[i].products[j].imgs[0]);
        }
      }
      preparedData[i].imgs = imgs;
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }
    return res.status(200).json({ data: preparedData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching collections', error: err.message });
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
        price: 1,
        quantity: 1,
        createdAt: 1,
        updatedAt: 1,
        products: 1,
        deleted: 1,
        sold: 1,
        rating: 1,
      },
    )
      .populate({
        path: 'products',
        populate: [{ path: 'authors' }, { path: 'categories' }],
      })
      .lean();
    const authors = [];
    for (let i = 0; i < collectionData.products.length; i++) {
      const productAuthors = collectionData.products[i].authors;
      for (let j = 0; j < productAuthors.length; j++) {
        if (!authors.find(author => author._id == productAuthors[j]._id)) {
          authors.push(productAuthors[j]);
        }
      }
    }
    const categories = [];
    for (let i = 0; i < collectionData.products.length; i++) {
      const productCategories = collectionData.products[i].categories;
      for (let j = 0; j < productCategories.length; j++) {
        if (
          !categories.find(category => category._id == productCategories[j]._id)
        ) {
          categories.push(productCategories[j]);
        }
      }
    }
    const imgs = [];
    for (let i = 0; i < collectionData.products.length; i++) {
      if (collectionData.products[i].imgs.length > 0) {
        imgs.push(collectionData.products[i].imgs[0]);
      }
    }

    const preparedData = {
      ...collectionData,
      authors,
      imgs,
      categories,
      price: {
        ...collectionData.price,
        value: `${cashFormatter({
          number: collectionData.price.value,
        })}`,
      },
      products: collectionData.products.map(product => ({
        ...product,
        price: {
          ...product.price,
          value: `${cashFormatter({ number: product.price.value })}`,
        },
      })),
    };
    return res.status(200).json({ data: preparedData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching collection', error: err.message });
  }
};

const findSearchedCollections = async (req, res) => {};

const createOneCollection = async (req, res) => {
  const preparedData = req.collectionData;
  try {
    const _id = new mongoose.Types.ObjectId();
    const createdAt = new Date().getTime();

    await Collection.create({
      _id,
      createdAt,
      updatedAt: createdAt,
      ...preparedData,
    });
    return res
      .status(201)
      .json({ message: 'Succesfully added new product', id: _id });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching comments', error: err.message });
  }
};

const updateOneCollection = async (req, res) => {
  const { collectionId } = req.body;
  const preparedData = req.collectionData;
  try {
    await Collection.updateOne({ _id: collectionId }, preparedData);

    return res.json({ message: 'Successfully updated your collection' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed updating your collection', error: err.emssage });
  }
};

const deleteOneCollection = async (req, res) => {
  const { collectionId } = req.body;

  try {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let monthFromNow = currentMonth + 6;
    let futureDate = new Date(currentDate.getFullYear(), monthFromNow, 1);
    futureDate.setDate(futureDate.getDate() - 1);

    await Collection.updateOne(
      { _id: collectionId },
      { deleted: true, expireAt: futureDate },
    );

    return res.json({ message: 'Successfully removed collection.' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed removing collection.', error: err.message });
  }
};

module.exports = {
  findAllCollections,
  findOneCollection,
  findSearchedCollections,
  createOneCollection,
  updateOneCollection,
  deleteOneCollection,
};

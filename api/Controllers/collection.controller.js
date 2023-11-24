const { default: mongoose } = require('mongoose');
const Collection = require('../Models/collection');
const Product = require('../Models/product.js');
const cashFormatter = require('../helpers/cashFormatter.js');

const findAllCollections = async (req, res) => {
  const { limit = 10 } = req.query;
  const category = req.category;
  const sortMethod = req.sortMethod;
  const query = req.searchQuery;

  const rawData = {};

  try {
    const collectionData = await Collection.find(
      {
        products: {
          $in: await Product.find({ categories: category._id }).distinct('_id'),
        },
      },
      {
        _id: 1,
        title: 1,
        price: 1,
        shortDescription: 1,
        products: 1,
        rating: 1,
      },
    )
      .populate({ path: 'products', populate: ['categories', 'authors'] })
      .sort(sortMethod)
      .limit(limit)
      .lean();

    const preparedData = [...collectionData];

    for (let i = 0; i < collectionData.length; i++) {
      const imgs = [];
      const authors = [];
      const categories = [];

      for (let j = 0; j < collectionData[i].products.length; j++) {
        for (let k = 0; k < collectionData[i].products[j].authors.length; k++) {
          if (
            !authors.find(
              author =>
                author._id == collectionData[i].products[j].authors[k]._id,
            )
          ) {
            authors.push(collectionData[i].products[j].authors[k]);
          }
        }
        for (
          let k = 0;
          k < collectionData[i].products[j].categories.length;
          k++
        ) {
          if (
            !categories.find(
              category =>
                category._id == collectionData[i].products[j].categories[k]._id,
            )
          ) {
            categories.push(collectionData[i].products[j].categories[k]);
          }
        }
        if (collectionData[i].products[j].imgs.length > 0) {
          imgs.push(collectionData[i].products[j].imgs[0]);
        }
      }

      preparedData[i].imgs = imgs;
      preparedData[i].authors = authors;
      preparedData[i].categories = categories;
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }

    const pipeline = [];

    pipeline.push({
      $match: {
        ...query,
        quantity: { $gt: 0 },
        deleted: false,
        sold: false,
      },
    });
    pipeline.push({
      $group: {
        _id: null,
        maxNumber: { $max: '$price.value' },
      },
    });

    const highestPrice = await Collection.aggregate(pipeline);
    rawData.highestPrice =
      highestPrice.length > 0
        ? cashFormatter({ number: highestPrice[0].maxNumber })
        : cashFormatter({ number: 0 });

    return res.status(200).json({ data: { data: preparedData, rawData } });
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
  createOneCollection,
  updateOneCollection,
  deleteOneCollection,
};

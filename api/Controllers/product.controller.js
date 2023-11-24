const { default: mongoose } = require("mongoose");
const Product = require("../Models/product");
const Comment = require("../Models/comment");
const Order = require("../Models/order");

const calculateFutureDeleteDate = require("../helpers/calculate/calculateFutureDeleteDate");
const cashFormatter = require("../helpers/cashFormatter");

const getAllProducts = async (req, res) => {
  const query = req.preparedData;
  const { skipPages, currentPageSize, currentPage } = req.pageData;
  const sortMethod = req.sortMethod;
  const rawData = {};
  try {
    let flag = false;
    let skipPagesCopy = skipPages;
    do {
      productsData = await Product.find({
        ...query,
        deleted: false,
      })
        .sort(sortMethod)
        .skip(skipPagesCopy)
        .limit(currentPageSize)
        .populate(["authors", "categories"])
        .lean();
      if (productsData.length <= 0 && skipPages > 1 && currentPage > 1) {
        flag = true;
        skipPagesCopy -= skipPages;
        currentPage -= 1;
      } else {
        flag = false;
      }
    } while (flag);

    totalDocuments = await Product.find(query).countDocuments();
    totalPages = Math.ceil(totalDocuments / currentPageSize);

    const preparedData = [...productsData];

    for (let i = 0; i < productsData.length; i++) {
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }
    rawData.totalPages = totalPages;
    rawData.totalProducts = totalDocuments;

    return res.status(200).json({ data: { products: preparedData, rawData } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching data went wrong", error: err.message });
  }
};

const getShopProducts = async (req, res) => {
  const { limit = 10 } = req.query;
  const sortMethod = req.sortMethod;
  const query = req.queryData;
  try {
    const productsData = await Product.find({
      marketplace: "shop",
      quantity: { $gt: 0 },
      deleted: false,
      sold: false,
      ...query,
    })
      .sort(sortMethod)
      .populate(["authors", "categories"])
      .limit(limit)
      .lean();

    const preparedData = [...productsData];

    for (let i = 0; i < productsData.length; i++) {
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }

    const pipeline = [];
    if (query.categories) {
      pipeline.push({
        $match: {
          categories: query.categories,
        },
      });
    }
    pipeline.push({
      $group: {
        _id: null,
        maxNumber: { $max: "$price.value" },
      },
    });

    const highestPrice = await Product.aggregate(pipeline);

    const rawData = {};
    rawData.highestPrice =
      highestPrice.length > 0
        ? cashFormatter({ number: highestPrice[0].maxNumber })
        : cashFormatter({ number: 0 });

    return res.status(200).json({ data: { data: preparedData, rawData } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching shop data went wrong", error: err.message });
  }
};

const getCollectionProducts = async (req, res) => {
  const { limit = 10 } = req.query;
  const sortMethod = req.sortMethod;
  const query = req.queryData;
  try {
    const productsData = await Product.find({
      marketplace: "collection",
      quantity: { $gt: 0 },
      deleted: false,
      sold: false,
      ...query,
    })
      .sort(sortMethod)
      .populate(["authors", "categories"])
      .limit(limit)
      .lean();

    const preparedData = [...productsData];

    for (let i = 0; i < productsData.length; i++) {
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }

    const pipeline = [];
    if (query.categories) {
      pipeline.push({
        $match: {
          categories: query.categories,
        },
      });
    }
    pipeline.push({
      $group: {
        _id: null,
        maxNumber: { $max: "$price.value" },
      },
    });

    const highestPrice = await Product.aggregate(pipeline);

    const rawData = {};
    rawData.highestPrice =
      highestPrice.length > 0
        ? cashFormatter({ number: highestPrice[0].maxNumber })
        : cashFormatter({ number: 0 });

    return res.status(200).json({ data: { data: preparedData, rawData } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching shop data went wrong", error: err.message });
  }
};

const getOneProduct = async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    return res.status(422).json({ message: "Product id is requried" });
  }

  try {
    const product = await Product.findOne({ _id })
      .populate([
        { path: "categories", select: ["value", "label"] },
        {
          path: "authors",
          select: [
            "user_info.credentials.full_name",
            "_id",
            "author_info.pseudonim",
          ],
        },
      ])
      .lean();

    const preparedProduct = { ...product };

    preparedProduct.price = {
      ...preparedProduct.price,
      value: `${cashFormatter({
        number: preparedProduct.price.value,
      })}`,
    };

    const comments = await Comment.find({ "targetData._id": product._id })
      .populate("creatorData")
      .lean();
    preparedProduct.comments = comments;
    return res.status(200).json({ data: preparedProduct });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching data went wrong", error: err.message });
  }
};

const addOneProduct = async (req, res) => {
  const preparedData = req.productData;

  try {
    const _id = new mongoose.Types.ObjectId();
    const createdAt = new Date().getTime();

    try {
      await Product.create({
        _id,
        createdAt,
        updatedAt: createdAt,
        ...preparedData,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed creating new product", error: err.message });
    }

    return res
      .status(201)
      .json({ message: "Succesfully added new product", id: _id });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Adding product failed", error: err.message });
  }
};

const updateOneProduct = async (req, res) => {
  const { _id } = req.body;
  const preparedData = req.preparedData;
  try {
    const updatedAt = new Date().getTime();
    const productData = await Product.findOne(
      { _id },
      { marketplace: 1 }
    ).lean();

    await Product.updateOne({ _id }, { ...preparedData, updatedAt });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "Failed", error: err.message });
  }
};

const deleteOneProduct = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(422).json({ message: "Product id is required" });
  }

  try {
    const deleteDate = calculateFutureDeleteDate();

    await Product.updateOne({ _id }, { deleted: true, expireAt: deleteDate });
    return res
      .status(200)
      .json({ message: "Successfully deleted the product" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed deleting selected product",
      error: err.message,
    });
  }
};

const deleteAllProducts = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(422).json({ message: "User id is required" });
  }
  try {
    const deleteDate = calculateFutureDeleteDate();

    await Product.updateMany(
      { "creatorData._id": userId },
      { deleted: true, expireAt: deleteDate }
    );

    return res
      .status(200)
      .json({ message: "Successfully deleted all products" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed deleting all prodcuts", error: err.message });
  }
};

const productsQuantity = async (req, res) => {
  const { authorId } = req.query;
  try {
    const quantity = await Product.find({
      "creatorData._id": authorId,
    }).count();
    return res.status(200).json({ data: quantity });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed deleting all prodcuts", error: err.message });
  }
};

module.exports = {
  productsQuantity,
  getAllProducts,
  getCollectionProducts,
  getShopProducts,
  getOneProduct,
  addOneProduct,
  updateOneProduct,
  deleteOneProduct,
  deleteAllProducts,
};

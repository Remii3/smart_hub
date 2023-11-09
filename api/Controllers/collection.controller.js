const Collection = require("../Models/collection");

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
    const collectionData = await Collection.find(query)
      .sort(sortMethod)
      .limit(limit);
    return res.status(200).json({ data: collectionData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed fetching comments", error: err.message });
  }
};

const findOneCollection = async (req, res) => {};

const findSearchedCollections = async (req, res) => {};

const createOneCollection = async (req, res) => {};

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

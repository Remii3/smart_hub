const express = require('express');
const {
  findAllCollections,
  findOneCollection,
  createOneCollection,
  updateOneCollection,
  deleteOneCollection,
} = require('../Controllers/collection.controller');
const checkSortMethod = require('../Middleware/checkSortMethod.middleware');
const prepareNewCollectionData = require('../Middleware/Collection/prepareNewCollectionData.middleware');
const prepareUpdateCollectionData = require('../Middleware/Collection/prepareUpdateCollectionData.middleware');
const searchAllCollections = require('../Middleware/collection/searchAllCollections.middleware');

const router = express.Router();

router.get('/all', checkSortMethod, searchAllCollections, findAllCollections);
router.get('/one', findOneCollection);

router.post('/add-one', prepareNewCollectionData, createOneCollection);
router.post('/update-one', prepareUpdateCollectionData, updateOneCollection);
router.post('/delete-one', deleteOneCollection);

module.exports = router;

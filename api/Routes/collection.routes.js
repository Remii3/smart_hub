const express = require('express');
const {
  findAllCollections,
  findOneCollection,
  findSearchedCollections,
  createOneCollection,
  updateOneCollection,
  deleteOneCollection,
} = require('../Controllers/collection.controller');
const checkSortMethod = require('../Middleware/checkSortMethod.middleware');
const prepareNewCollectionData = require('../Middleware/Collection/prepareNewCollectionData.middleware');

const router = express.Router();

router.get('/all', checkSortMethod, findAllCollections);
router.get('/one', findOneCollection);
router.get('/searched', findSearchedCollections);

router.post('/add-one', prepareNewCollectionData, createOneCollection);
router.post('/update-one', updateOneCollection);
router.post('/delete-one', deleteOneCollection);

module.exports = router;

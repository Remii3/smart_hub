const express = require('express');

const router = express.Router();
const {
  getAllProducts,
  getShopProducts,
  getOneProduct,
  addOneProduct,
  updateOneProduct,
  deleteOneProduct,
  deleteAllProducts,
  productsQuantity,
  getCollectionProducts,
} = require('../Controllers/product.controller');
const prepareFindOne = require('../Middleware/product/prepareFindOne.middleware');
const prepareNewProductData = require('../Middleware/product/prepareNewProductData.middleware');
const checkSortMethod = require('../Middleware/checkSortMethod.middleware');
const prepareUpdate = require('../Middleware/product/prepareUpdate.middleware');
const prepareFindProducts = require('../Middleware/product/prepareFindProducts.middleware');

router.get('/all', checkSortMethod, prepareFindProducts, getAllProducts);
router.get('/shop', checkSortMethod, prepareFindProducts, getShopProducts);
router.get(
  '/collection',
  checkSortMethod,
  prepareFindProducts,
  getCollectionProducts,
);
router.get('/one', getOneProduct);
router.get('/quantity', productsQuantity);

router.post('/one', prepareNewProductData, addOneProduct);
router.post('/update', prepareUpdate, updateOneProduct);
router.post('/delete', deleteOneProduct);
router.post('/delete-all', deleteAllProducts);
module.exports = router;

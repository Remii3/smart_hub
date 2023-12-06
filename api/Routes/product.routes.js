const express = require("express");

const router = express.Router();
const {
  getAllProducts,
  getShopProducts,
  getOneProduct,
  addOneProduct,
  updateOneProduct,
  deleteOneProduct,
  productsQuantity,
  getCollectionProducts,
  deleteAllCreatorProducts,
} = require("../Controllers/product.controller");
const checkSortMethod = require("../Middleware/checkSortMethod.middleware");
const prepareFindProducts = require("../Middleware/product/prepareFindProducts.middleware");
const prepareUpdateProduct = require("../Middleware/product/prepareUpdateProduct.middleware");
const prepareCreateProduct = require("../Middleware/product/prepareNewProductData.middleware");

router.get("/all", checkSortMethod, prepareFindProducts, getAllProducts);
router.get("/shop", checkSortMethod, prepareFindProducts, getShopProducts);
router.get(
  "/collection",
  checkSortMethod,
  prepareFindProducts,
  getCollectionProducts
);
router.get("/one", getOneProduct);
router.get("/quantity", productsQuantity);

router.post("/one", prepareCreateProduct, addOneProduct);
router.post("/update", prepareUpdateProduct, updateOneProduct);
router.post("/delete", deleteOneProduct);
router.post("/delete-all", deleteAllCreatorProducts);
module.exports = router;

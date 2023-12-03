const express = require('express');

const router = express.Router();
const {
  getAllOrders,
  getOneOrder,
  addOneOrder,
  getSearchOrder,
  deleteOneOrder,
  deleteAllOrders,
} = require('../Controllers/order.controller');

router.get('/all', getAllOrders);
router.get('/one', getOneOrder);
router.get('/search', getSearchOrder);

router.post('/delete', deleteOneOrder);
router.post('/delete-all', deleteAllOrders);
router.post('/one', addOneOrder);

module.exports = router;

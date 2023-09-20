const express = require('express');

const router = express.Router();
const {
  getAllOrders,
  getOneOrder,
  addOneOrder,
} = require('../Controllers/order.controller');

router.get('/all', getAllOrders);
router.get('/one', getOneOrder);

router.post('/one', addOneOrder);

module.exports = router;

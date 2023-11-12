const express = require('express');
const {
  getAllNews,
  getOneNews,
  addOneNews,
  deleteOneNews,
  updateOne,
} = require('../Controllers/news.controller');

const router = express.Router();

router.get('/all', getAllNews);
router.get('/one', getOneNews);

router.post('/one', addOneNews);
router.post('/update', updateOne);
router.post('/delete', deleteOneNews);

module.exports = router;

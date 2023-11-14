const express = require('express');
const {
  getAllNews,
  getOneNews,
  addOneNews,
  deleteOneNews,
  updateOne,
  findSearchedNews,
} = require('../Controllers/news.controller');
const checkSortMethod = require('../Middleware/checkSortMethod.middleware');
const prepareNewsSearch = require('../Middleware/news/prepareNewsSearch');

const router = express.Router();

router.get('/all', getAllNews);
router.get('/one', getOneNews);
router.get('/search', checkSortMethod, prepareNewsSearch, findSearchedNews);

router.post('/one', addOneNews);
router.post('/update', updateOne);
router.post('/delete', deleteOneNews);

module.exports = router;

const express = require('express');
const { allNews, oneNews, addNews } = require('../Controllers/news.controller');

const router = express.Router();

router.get('/all', allNews);
router.get('/one', oneNews);

router.post('/one', addNews);

module.exports = router;

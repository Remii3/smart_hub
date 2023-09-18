const express = require('express');
const {
  allNews,
  oneNews,
  addNews,
  newsComments,
  addVote,
  removeVote,
} = require('../Controllers/news.controller');

const router = express.Router();

router.get('/all', allNews);
router.get('/one', oneNews);
router.get('/comments', newsComments);

router.post('/one', addNews);
router.post('/vote-add', addVote);
router.post('/vote-remove', removeVote);

module.exports = router;

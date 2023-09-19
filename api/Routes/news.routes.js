const express = require('express');
const {
  allNews,
  oneNews,
  addNews,
  newsComments,
  addVote,
  removeVote,
  getVotes,
  deleteNews,
} = require('../Controllers/news.controller');

const router = express.Router();

router.get('/all', allNews);
router.get('/one', oneNews);
router.get('/comments', newsComments);
router.get('/votes', getVotes);

router.post('/one', addNews);
router.post('/delete', deleteNews);
router.post('/vote-add', addVote);
router.post('/vote-remove', removeVote);

module.exports = router;

const express = require('express');
const {
  getAllNews,
  getOneNews,
  addOneNews,
  deleteOneNews,
  addOneVote,
  removeOneVote,
  getAllVotes,
} = require('../Controllers/news.controller');

const router = express.Router();

router.get('/all', getAllNews);
router.get('/one', getOneNews);
router.get('/votes', getAllVotes);

router.post('/one', addOneNews);
router.post('/delete', deleteOneNews);
router.post('/vote-add', addOneVote);
router.post('/vote-remove', removeOneVote);

module.exports = router;

const express = require('express');
const {
  getAllNews,
  getOneNews,
  addOneNews,
  deleteOneNews,
  addOneVote,
  removeOneVote,
  getAllVotes,
  updateOne,
} = require('../Controllers/news.controller');

const router = express.Router();

router.get('/all', getAllNews);
router.get('/one', getOneNews);
router.get('/votes', getAllVotes);

router.post('/one', addOneNews);
router.post('/update', updateOne);
router.post('/delete', deleteOneNews);
router.post('/vote-add', addOneVote);
router.post('/vote-remove', removeOneVote);

module.exports = router;

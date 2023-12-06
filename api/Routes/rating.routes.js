const express = require('express');
const {
  getRating,
  getAllVotes,
  addOneVote,
  removeOneVote,
} = require('../Controllers/rating.controller');

const router = express.Router();

router.get('/rating', getRating);
router.get('/votes', getAllVotes);
router.post('/vote-add', addOneVote);
router.post('/vote-remove', removeOneVote);

module.exports = router;

const express = require('express');

const router = express.Router();

const {
  addComment,
  getComments,
} = require('../Controllers/comment.controller');

router.get('/all', getComments);
router.get('/one');

router.post('/one', addComment);

module.exports = router;

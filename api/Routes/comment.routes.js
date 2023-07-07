const express = require('express');

const router = express.Router();

const {
  addComment,
  getComments,
} = require('../Controllers/comment.controller');

router.get('/get-comments', getComments);
router.post('/add-comment', addComment);

module.exports = router;

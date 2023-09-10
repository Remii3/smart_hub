const express = require('express');

const router = express.Router();

const {
  addComment,
  allComments,
  oneComment,
} = require('../Controllers/comment.controller');

router.get('/all', allComments);
router.get('/one', oneComment);

router.post('/one', addComment);

module.exports = router;

const express = require('express');

const router = express.Router();

const {
  addComment,
  allComments,
  oneComment,
  commentDelete,
} = require('../Controllers/comment.controller');

router.get('/all', allComments);
router.get('/one', oneComment);

router.post('/one', addComment);
router.post('/delete', commentDelete);

module.exports = router;

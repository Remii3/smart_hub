const express = require('express');

const router = express.Router();

const {
  getAllComments,
  addOneComment,
  deleteOneComment,
} = require('../Controllers/comment.controller');

router.get('/all', getAllComments);

router.post('/one', addOneComment);
router.post('/delete', deleteOneComment);

module.exports = router;

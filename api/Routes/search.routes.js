const express = require('express');
const checkSortMethod = require('../Middleware/checkSortMethod.middleware');
const { mainSearch } = require('../Controllers/search.controller');
const prodCol = require('../Middleware/search/prodCol.middleware');

const router = express.Router();

router.get('/prodCol', checkSortMethod, prodCol, mainSearch);
module.exports = router;

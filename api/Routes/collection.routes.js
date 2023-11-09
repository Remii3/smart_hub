const express = require("express");
const { findAllCollections } = require("../Controllers/collection.controller");

const router = express.Router();

router.get("/all", findAllCollections);

module.exports = router;

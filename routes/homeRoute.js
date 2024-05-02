const express = require("express");
const router = express.Router();
const { postQuery, ignoreQuery } = require("../controllers/homeController");

// Define routes
router.post("/postQuery", postQuery);
router.delete("/ignoreQuery", ignoreQuery);

module.exports = router;
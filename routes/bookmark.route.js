const express = require("express");
const router = express.Router();
const {
  bookmarkComment,
  Deletebookmark,
} = require("../controllers/bookmark.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/bookmarkComment", ensureAuthenticated, bookmarkComment);
router.delete("/deletebookmark", ensureAuthenticated, Deletebookmark);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createfirstComment,
  addReply,
} = require("../controllers/comment.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/postComment", ensureAuthenticated, createfirstComment);
router.post("/addreply", ensureAuthenticated, addReply);

module.exports = router;

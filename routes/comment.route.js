const express = require("express");
const router = express.Router();
const {
  createfirstComment,
  addReply,
  getCommentAndReplies,
} = require("../controllers/comment.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/postComment", ensureAuthenticated, createfirstComment);
router.post("/addreply", ensureAuthenticated, addReply);
router.get("/getComment", ensureAuthenticated, getCommentAndReplies);

module.exports = router;

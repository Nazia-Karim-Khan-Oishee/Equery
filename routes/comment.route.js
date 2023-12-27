const express = require("express");
const router = express.Router();
const {
  createfirstComment,
  addReply,
  getCommentAndReplies,
  deleteComment,
  updateComment,
} = require("../controllers/comment.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/postComment", ensureAuthenticated, createfirstComment);
router.post("/addreply", ensureAuthenticated, addReply);
router.get("/getComment", ensureAuthenticated, getCommentAndReplies);
router.patch("/updateComment", ensureAuthenticated, updateComment);
router.delete("/deleteComment", ensureAuthenticated, deleteComment);

module.exports = router;

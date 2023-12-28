const express = require("express");
const router = express.Router();
const {
  postVote,
  postVotetoComment,
  updateVote,
} = require("../controllers/vote.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/postVote/Question", ensureAuthenticated, postVote);
router.post("/postVote/Comment", ensureAuthenticated, postVotetoComment);
router.patch("/update", ensureAuthenticated, updateVote);

module.exports = router;

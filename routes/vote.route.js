const express = require("express");
const router = express.Router();
const { postVote } = require("../controllers/vote.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/postVote", ensureAuthenticated, postVote);

module.exports = router;

const express = require("express");
const router = express.Router();
const { createQuestion } = require("../controllers/question.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/postQuestion", ensureAuthenticated, createQuestion);

module.exports = router;

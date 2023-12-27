const express = require("express");
const router = express.Router();
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  readQuestion,
} = require("../controllers/question.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/postQuestion", ensureAuthenticated, createQuestion);
router.put("/updateQuestion", ensureAuthenticated, updateQuestion);
router.delete("/deleteQuestion", ensureAuthenticated, deleteQuestion);
router.get("/readQuestion", ensureAuthenticated, readQuestion);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createQuestion,
  updateQuestionsText,
  updateQuestionsTopic,
  deleteQuestion,
  readQuestion,
  searchQuestionsByTopic,
  searchQuestions,
} = require("../controllers/question.controller");

const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/postQuestion", ensureAuthenticated, createQuestion);
router.patch("/updateQuestionText", ensureAuthenticated, updateQuestionsText);
router.patch("/updateQuestionTopic", ensureAuthenticated, updateQuestionsTopic);
router.delete("/deleteQuestion", ensureAuthenticated, deleteQuestion);
router.get("/readQuestion", ensureAuthenticated, readQuestion);
router.get(
  "/searchQuestionbyTopic",
  ensureAuthenticated,
  searchQuestionsByTopic
);
router.get(
  "/searchQuestionbyTopicandDate",
  ensureAuthenticated,
  searchQuestions
);
module.exports = router;

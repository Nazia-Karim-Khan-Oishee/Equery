const Question = require("../datamodels/Question.model");
const path = require("path");
const fs = require("fs");

const createQuestion = async (req, res) => {
  try {
    const { text, topic } = req.body;
    const newQuestion = new Question({ text, topic, uploaderId: req.user.id });

    const savedQuestion = await newQuestion.save();
    console.log("Question Created");
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateQuestionsText = async (req, res) => {
  try {
    const { text } = req.body;
    const questionID = req.query.questionID;

    const existingQuestion = await Question.findById(questionID);

    if (!existingQuestion) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    if (existingQuestion.uploaderId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionID,
      { text: text },
      { new: true }
    );

    console.log("Question Updated ");
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateQuestionsTopic = async (req, res) => {
  try {
    const { topic } = req.body;
    const questionID = req.query.questionID;

    const existingQuestion = await Question.findById(questionID);

    if (!existingQuestion) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    if (existingQuestion.uploaderId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionID,
      { topic: topic },
      { new: true }
    );

    console.log("Question Updated ");
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const questionID = req.query.questionID;

    const existingQuestion = await Question.findById(questionID);
    if (!existingQuestion) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    if (existingQuestion.uploaderId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deletedQuestion = await Question.findByIdAndDelete(questionID);

    console.log("Question Deleted");
    res.status(200).json({ response: "Question deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const readQuestion = async (req, res) => {
  try {
    const questionID = req.query.questionID;

    const existingQuestion = await Question.findById(questionID);
    if (!existingQuestion) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    console.log("Got Question ");
    res.status(200).json(existingQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const searchQuestionsByTopic = async (req, res) => {
  try {
    const topic = req.query.topic;

    const regex = new RegExp(topic, "i");

    const questions = await Question.find({ topic: regex });

    if (!questions || questions.length === 0) {
      console.log("No questions found for the specified topic");
      return res
        .status(404)
        .json({ error: "No questions found for the specified topic" });
    }

    const questionsTextOnly = questions.map((question) => question.text);
    console.log("Read questions.");
    res.status(200).json(questionsTextOnly);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const searchQuestions = async (req, res) => {
  try {
    const topic = req.query.topic;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const searchCriteria = {};

    if (topic) {
      const topicRegex = new RegExp(topic, "i");
      searchCriteria.topic = topicRegex;
    }

    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);

      searchCriteria.timestamp = { $gte: startDateObj, $lt: endDateObj };
    } else if (startDate) {
      searchCriteria.timestamp = { $gte: new Date(startDate) };
    } else if (endDate) {
      searchCriteria.timestamp = { $lt: new Date(endDate) };
    }

    const questions = await Question.find(searchCriteria);

    if (!questions || questions.length === 0) {
      console.log("No questions found for the specified criteria");
      return res
        .status(404)
        .json({ error: "No questions found for the specified criteria" });
    }

    const questionsTextOnly = questions.map((question) => question.text);
    console.log("Read questions.");

    res.status(200).json(questionsTextOnly);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createQuestion,
  updateQuestionsText,
  updateQuestionsTopic,
  deleteQuestion,
  searchQuestions,
  readQuestion,
  searchQuestionsByTopic,
};

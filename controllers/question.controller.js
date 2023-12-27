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

const updateQuestion = async (req, res) => {
  try {
    const { text, topic } = req.body;
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
      { text: text, topic: topic },
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

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  readQuestion,
};

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

module.exports = {
  createQuestion,
};

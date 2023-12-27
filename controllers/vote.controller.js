const express = require("express");
const router = express.Router();
const Question = require("../datamodels/Question.model");
const Vote = require("../datamodels/Vote.model");

const postVote = async (req, res) => {
  try {
    const { questionId, typeOfVote } = req.query;

    if (!["upvote", "downvote"].includes(typeOfVote)) {
      return res.status(400).json({ error: "Invalid type of vote" });
    }

    const voterId = req.user.id;
    let reduce = 0;
    const existingVote = await Vote.findOne({
      questionId,
      voterId,
    });

    if (existingVote) {
      if (existingVote.typeOfVote === typeOfVote) {
        return res
          .status(400)
          .json({ error: "You have already voted the question" });
      } else {
        existingVote.typeOfVote = typeOfVote;
        reduce = 1;
      }
      await existingVote.save();
    } else {
      const newVote = new Vote({
        questionId,
        voterId,
        typeOfVote,
      });
      await newVote.save();
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (typeOfVote === "upvote") {
      if (reduce) {
        question.downvotes -= 1;
      }
      question.upvotes += 1;
    } else {
      if (reduce) {
        question.upvotes -= 1;
      }
      question.downvotes += 1;
    }

    await question.save();
    console.log("Vote recorded successfully");
    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { postVote };

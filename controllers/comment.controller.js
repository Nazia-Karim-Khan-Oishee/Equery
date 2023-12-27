const Question = require("../datamodels/Question.model");
const Comment = require("../datamodels/Comment.model");

const path = require("path");
const fs = require("fs");

const createfirstComment = async (req, res) => {
  try {
    const { questionId } = req.query;
    const { comment } = req.body;

    const questionExists = await Question.exists({ _id: questionId });
    if (!questionExists) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    const newComment = new Comment({
      questionId,
      comment: comment,
      commenterId: req.user.id,
    });

    const savedComment = await newComment.save();
    console.log("Comment posted");
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addReply = async (req, res) => {
  try {
    const { reply } = req.body;
    const { commentId } = req.query; // Extract commentId from query parameters

    const newReply = new Comment({
      comment: reply,
      commenterId: req.user.id,
    });

    const savedReply = await newReply.save();

    // Find the parent comment and push the reply's _id to its replies array
    const parentComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: savedReply._id } },
      { new: true }
    );

    return res.status(201).json(savedReply);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error adding reply");
  }
};

module.exports = {
  createfirstComment,
  addReply,
};

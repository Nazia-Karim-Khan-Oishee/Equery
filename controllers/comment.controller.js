const Question = require("../datamodels/Question.model");
const Comment = require("../datamodels/Comment.model");

// const path = require("path");
// const fs = require("fs");

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

const getCommentAndReplies = async (req, res) => {
  try {
    const commentId = req.query.commentId;

    const getCommentWithReplies = async (commentId) => {
      const comment = await Comment.findById(commentId).populate(
        "replies.commenterId"
      );

      if (!comment) {
        return null;
      }

      const nestedReplies = await Promise.all(
        comment.replies.map((reply) => getCommentWithReplies(reply._id))
      );

      comment.replies = nestedReplies;

      return comment;
    };

    const commentWithReplies = await getCommentWithReplies(commentId);

    if (!commentWithReplies) {
      console.log("Comment not found");
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(commentWithReplies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const updateComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const commentID = req.query.commentID;

    const existingComment = await Comment.findById(commentID);

    if (!existingComment) {
      console.log("Comment not found");
      return res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment.commenterId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentID,
      { comment: comment },
      { new: true }
    );

    console.log("Comment Updated ");
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentID = req.query.commentID;

    const existingComment = await Comment.findById(commentID);
    if (!existingComment) {
      console.log("Comment not found");
      return res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment.commenterId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentID);

    console.log("Comment Deleted");
    res.status(200).json({ Response: "Comment Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  createfirstComment,
  addReply,
  getCommentAndReplies,
  deleteComment,
  updateComment,
};

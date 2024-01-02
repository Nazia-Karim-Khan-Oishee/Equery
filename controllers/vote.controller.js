const express = require("express");
const router = express.Router();
const Question = require("../datamodels/Question.model");
const Comment = require("../datamodels/Comment.model");
const Vote = require("../datamodels/Vote.model");

const postVote = async (req, res) => {
  try {
    const { questionId, typeOfVote } = req.query;

    if (!["upvote", "downvote"].includes(typeOfVote)) {
      return res.status(400).json({ error: "Invalid type of vote" });
    }

    const voterId = req.user.id;
    let reduce = 0;
    let newVote;

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
      newVote = existingVote;
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
    res.status(200).json({ newVote });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const updateVote = async (req, res) => {
  try {
    const { voteId } = req.query;

    // const voterId = req.user.id;
    const existingVote = await Vote.findById(voteId);

    if (!existingVote) {
      return res.status(404).json({ error: "Vote not found" });
    }

    if (existingVote.voterId.toString() !== req.user.id) {
      return res.status(400).json({ error: "Unauthorized access" });
    }

    existingVote.typeOfVote =
      existingVote.typeOfVote === "upvote" ? "downvote" : "upvote";

    await existingVote.save();

    const question = await Question.findById(existingVote.questionId);

    if (question) {
      // Update the upvotes and downvotes based on the changed typeOfVote
      if (existingVote.typeOfVote === "upvote") {
        question.downvotes += 1;
        question.upvotes -= 1;
      } else {
        question.upvotes += 1;
        question.downvotes -= 1;
      }

      await question.save();
    } else {
      const comment = await Comment.findById(existingVote.questionId);

      if (comment) {
        if (existingVote.typeOfVote === "upvote") {
          comment.downvotes += 1;
          comment.upvotes -= 1;
        } else {
          comment.upvotes += 1;
          comment.downvotes -= 1;
        }

        await comment.save();
      }
    }

    console.log("Vote updated successfully");
    res.status(200).json({ existingVote });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const postVotetoComment = async (req, res) => {
  try {
    const { questionId, typeOfVote } = req.query;

    if (!["upvote", "downvote"].includes(typeOfVote)) {
      return res.status(400).json({ error: "Invalid type of vote" });
    }

    const voterId = req.user.id;
    let reduce = 0;
    let newVote;
    const existingVote = await Vote.findOne({
      questionId,
      voterId,
    });

    if (existingVote) {
      if (existingVote.typeOfVote === typeOfVote) {
        return res
          .status(400)
          .json({ error: "You have already voted the comment" });
      } else {
        existingVote.typeOfVote = typeOfVote;
        reduce = 1;
      }
      await existingVote.save();
      newVote = existingVote;
    } else {
      newVote = new Vote({
        questionId,
        voterId,
        typeOfVote,
      });
      await newVote.save();
    }

    const comment = await Comment.findById(questionId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (typeOfVote === "upvote") {
      if (reduce) {
        comment.downvotes -= 1;
      }
      comment.upvotes += 1;
    } else {
      if (reduce) {
        comment.upvotes -= 1;
      }
      comment.downvotes += 1;
    }

    await comment.save();
    console.log("Vote recorded successfully");
    res.status(200).json({ newVote });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteVote = async (req, res) => {
  try {
    const voteId = req.params.Id;

    const voterId = req.user.id;
    const existingVote = await Vote.findById(voteId);
    console.log(voteId);
    if (!existingVote) {
      return res.status(404).json({ error: "Vote not found" });
    }

    if (existingVote.voterId.toString() !== voterId) {
      return res.status(400).json({ error: "Unauthorized access" });
    }

    const question = await Question.findById(existingVote.questionId);

    if (question) {
      if (existingVote.typeOfVote === "upvote") {
        question.upvotes -= 1;
      } else {
        question.downvotes -= 1;
      }

      await question.save();
    } else {
      const comment = await Comment.findById(existingVote.questionId);

      if (comment) {
        if (existingVote.typeOfVote === "upvote") {
          comment.upvotes -= 1;
        } else {
          comment.downvotes -= 1;
        }

        await comment.save();
      }
    }
    await Vote.findByIdAndDelete(voteId);

    // await deletedVote.save();

    console.log("Vote deleted successfully");
    res.send("Vote deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { postVote, postVotetoComment, updateVote, deleteVote };

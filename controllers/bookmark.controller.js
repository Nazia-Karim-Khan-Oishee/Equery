const express = require("express");
const Bookmark = require("../datamodels/Bookmark.model");

const bookmarkComment = async (req, res) => {
  try {
    const { commentId } = req.query;
    const userId = req.user.id;

    const existingBookmark = await Bookmark.findOne({
      userId,
      commentId,
    });

    if (existingBookmark) {
      return res.status(400).json({ error: "Comment already bookmarked" });
    }

    const newBookmark = new Bookmark({
      userId,
      commentId,
    });

    await newBookmark.save();
    console.log("Comment bookmarked successfully");

    res.status(200).json({ response: "Comment bookmarked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const Deletebookmark = async (req, res) => {
  try {
    const { commentId } = req.query;
    const userId = req.user.id;

    const deletedBookmark = await Bookmark.findOneAndDelete({
      userId,
      commentId,
    });

    if (deletedBookmark) {
      console.log("Bookmark removed");
      return res.status(200).json({ error: "Bookmark removed" });
    }

    // res.status(200).json({ response: "Comment bookmarked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { bookmarkComment, Deletebookmark };

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
      return res.send("Comment is already bookmarked");
    }

    const newBookmark = new Bookmark({
      userId,
      commentId,
    });

    await newBookmark.save();
    console.log("Comment bookmarked successfully");

    res.status(200).json({ newBookmark });
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

const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all bookmarks for the specified user, populate the associated comments
    const userBookmarks = await Bookmark.find({ userId }).populate("commentId");

    if (!userBookmarks || userBookmarks.length === 0) {
      return res
        .status(404)
        .json({ response: "No bookmarks found for the user." });
    }

    // Extract text from each comment, handling null cases
    const commentTexts = userBookmarks.map((bookmark) =>
      bookmark.commentId ? bookmark.commentId.comment : null
    );

    console.log("Got Bookmarks with Comments");

    res.status(200).json(commentTexts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { bookmarkComment, Deletebookmark, getBookmarks };

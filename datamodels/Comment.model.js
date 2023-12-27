const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  comment: String,
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  commenterId: String,
  timestamp: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

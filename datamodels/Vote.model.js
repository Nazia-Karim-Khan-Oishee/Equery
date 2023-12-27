const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  voterId: String,
  typeOfVote: {
    type: String,
    enum: ["upvote", "downvote"],
  },
  timestamp: { type: Date, default: Date.now },
});

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;

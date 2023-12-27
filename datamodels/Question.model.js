const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  topic: String,
  uploaderId: String,
  timestamp: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

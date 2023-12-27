const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  topic: String,
  uploaderId: String,
  timestamp: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

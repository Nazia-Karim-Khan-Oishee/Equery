const mongoose = require("mongoose");

const ResouceSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  uploader: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    default: "",
  },
});

const Resource = mongoose.model("Resource", ResouceSchema);
module.exports = Resource;

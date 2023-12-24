const Resource = require("../datamodels/Resource.model");
const path = require("path");

const createResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const pdf = req.file.filename;
    const { text } = req.body;

    const newResource = new Resource({
      uploader: req.user.id,
      pdf: pdf,
      text: text,
    });

    await newResource.save();
    console.log("Resource Uploaded");

    res.status(200).json({ newResource });
  } catch (error) {
    console.log("Something went wrong");
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createResource,
};

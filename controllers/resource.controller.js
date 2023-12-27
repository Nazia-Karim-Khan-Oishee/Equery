const Resource = require("../datamodels/Resource.model");
const path = require("path");
const fs = require("fs");

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

const updateText = async (req, res, next) => {
  const resourceID = req.params.resourceId;
  console.log(resourceID);

  const existingResource = await Resource.findById(resourceID);

  if (!existingResource) {
    console.log("No resource found");
    return res.status(404).json({ error: "Resource not found" });
  }

  if (existingResource.uploader !== req.user.id) {
    console.log("Unauthorized");
    return res.status(400).json({ error: "Unauthorized" });
  }
  const { text } = req.body;

  const updatedResource = await Resource.findByIdAndUpdate(
    resourceID,
    { text: text },
    { new: true }
  );

  if (!updatedResource) {
    console.log("No resource found");
    return res.status(404).json({ error: "Resource not found" });
  }

  console.log("Text Updated ");

  res.json({ message: "Text updated successfully" });
};

const updatePDF = async (req, res, next) => {
  // console.log(userId);
  const resourceID = req.params.resourceId;
  console.log(resourceID);

  const existingResource = await Resource.findById(resourceID);

  if (!existingResource) {
    console.log("No resource found");
    return res.status(404).json({ error: "Resource not found" });
  }

  if (existingResource.uploader !== req.user.id) {
    console.log("Unauthorized");
    return res.status(400).json({ error: "Unauthorized" });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const pdf = req.file.filename;

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceID,
      { pdf: pdf },
      { new: true }
    );

    if (!updatedResource) {
      console.log("No resource found");
      return res.status(404).json({ error: "Resource not found" });
    }

    console.log("PDF Updated ");

    res.json({ message: "PDF updated successfully" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error.message });
  }
};

const deleteResource = async (req, res, next) => {
  // console.log(userId);
  const resourceID = req.params.resourceId;
  console.log(resourceID);

  const existingResource = await Resource.findById(resourceID);

  if (!existingResource) {
    console.log("No resource found");
    return res.status(404).json({ error: "Resource not found" });
  }

  if (existingResource.uploader !== req.user.id) {
    console.log("Unauthorized");
    return res.status(400).json({ error: "Unauthorized" });
  }

  try {
    await Resource.findByIdAndDelete(resourceID);

    console.log("Resource Deleted ");

    res.json({ message: "Resource Deleted" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error.message });
  }
};

const getResource = async (req, res, next) => {
  try {
    const existingresourceID = req.params.resourceId;
    const existingResource = await Resource.findById(
      existingresourceID,
      "-uploader"
    );

    res.status(200).json({ existingResource });
    console.log(existingResource.pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createResource,
  updateText,
  updatePDF,
  getResource,
  deleteResource,
};

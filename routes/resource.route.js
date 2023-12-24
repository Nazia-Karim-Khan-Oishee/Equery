const express = require("express");
const router = express.Router();
const { createResource } = require("../controllers/resource.controller");

const { uploadResource } = require("../middleware/pdf.middleware");
const ensureAuthenticated = require("../middleware/auth.middleware");

router.post(
  "/postResource",
  ensureAuthenticated,
  uploadResource.single("pdf"),
  createResource
);

module.exports = router;

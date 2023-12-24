const express = require("express");
const router = express.Router();
const {
  createResource,
  updatePDF,
  updateText,
} = require("../controllers/resource.controller");

const { uploadResource } = require("../middleware/pdf.middleware");
const ensureAuthenticated = require("../middleware/auth.middleware");

router.post(
  "/postResource",
  ensureAuthenticated,
  uploadResource.single("pdf"),
  createResource
);
router.patch(
  "/resource/updateText/:resourceId",
  ensureAuthenticated,
  updateText
);
router.patch(
  "/resource/updatePDF/:resourceId",
  ensureAuthenticated,
  uploadResource.single("pdf"),
  updatePDF
);
module.exports = router;

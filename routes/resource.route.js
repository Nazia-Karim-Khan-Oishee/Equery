const express = require("express");
const router = express.Router();
const {
  createResource,
  updatePDF,
  updateText,
  deleteResource,
  getResource,
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

router.delete(
  "/deleteResource/:resourceId",
  ensureAuthenticated,
  deleteResource
);

router.get("/getresource/:resourceId", ensureAuthenticated, getResource);

module.exports = router;

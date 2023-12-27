const express = require("express");
const router = express.Router();
const {
  updateUserName,
  updatePasssword,
  postProfileImage,
  getProfileImage,
  getProfile,
  updateProfilePicture,
  deleteProfileImage,
} = require("../controllers/profile.controller");

const { uploadProfileImage } = require("../middleware/image.middleware");
const ensureAuthenticated = require("../middleware/auth.middleware");

router.patch("/users/updatepassword", ensureAuthenticated, updatePasssword);
router.patch("/users/updateUsername", ensureAuthenticated, updateUserName);
router.patch(
  "/users/updatepicture",
  ensureAuthenticated,
  uploadProfileImage.single("image"),
  updateProfilePicture
);

router.post(
  "/postProfileImage",
  ensureAuthenticated,
  uploadProfileImage.single("image"),
  postProfileImage
);

router.get("/getprofileimage", ensureAuthenticated, getProfileImage);
router.get("/getprofile", ensureAuthenticated, getProfile);

router.delete(
  "/user/deletePicture/:id",
  ensureAuthenticated,
  deleteProfileImage
);

module.exports = router;

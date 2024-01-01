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
  getResourcesByUser,
  getQuestionsByUser,
  getCommentsByUser,
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
router.get("/activity/getResources", ensureAuthenticated, getResourcesByUser);
router.get("/activity/getQuestions", ensureAuthenticated, getQuestionsByUser);
router.get("/activity/getComments", ensureAuthenticated, getCommentsByUser);

router.delete("/user/deletePicture", ensureAuthenticated, deleteProfileImage);

module.exports = router;

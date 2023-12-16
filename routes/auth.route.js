const express = require("express");
const router = express.Router();
const {
  postRegister,
  getLogout,
  postLogin,
  getLogin,
  putPasssword,
  showerror,
  postProfileImage,
  getProfileImage,
} = require("../controllers/auth.controller");

const { uploadProfileImage } = require("../middleware/image.middleware");
const ensureAuthenticated = require("../middleware/auth.middleware");

router.post("/register", postRegister);
router.get("/logout", getLogout);
router.post("/login", postLogin);
router.get("/login", getLogin);
router.get("/error", showerror);
router.put("/users/updatepassword", ensureAuthenticated, putPasssword);
router.put("/users/forgetpassword", ensureAuthenticated, putPasssword);
router.post(
  "/postProfileImage",
  ensureAuthenticated,
  uploadProfileImage.single("image"),
  postProfileImage
);
router.get("/getprofileimage", ensureAuthenticated, getProfileImage);

module.exports = router;

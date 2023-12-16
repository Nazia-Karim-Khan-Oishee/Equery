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
} = require("../controllers/auth.controller");

const { uploadProfileImage } = require("../middleware/image.middleware");

router.post("/register", postRegister);
router.get("/logout", getLogout);
router.post("/login", postLogin);
router.get("/login", getLogin);
router.get("/error", showerror);
router.put("/users/updatepassword", putPasssword);
router.put("/users/forgetpassword", putPasssword);
router.post(
  "/postProfileImage",
  uploadProfileImage.single("image"),
  postProfileImage
);

module.exports = router;

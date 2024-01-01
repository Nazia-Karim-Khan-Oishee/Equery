const express = require("express");
const router = express.Router();
const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const path = require("path");

const {
  postRegister,
  getLogout,
  forgetPasssword,
  postLogin,
  getLogin,
  reset_password,
  showerror,
} = require("../controllers/auth.controller");

router.post("/register", postRegister);
router.post("/login", postLogin);
router.patch("/reset-password/:id/:token", reset_password);

router.get("/logout", getLogout);
router.get("/welcome", getLogin);
router.get("/welcomeOauth", (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "oauthUser.html");
  res.status(400).sendFile(filePath);
});
router.get("/error", showerror);

router.patch("/users/forgetpassword", forgetPasssword);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    successRedirect: "/welcomeOauth", // Redirect to a success page
    failureRedirect: "/error", // Redirect to the home page or login page on failure
  })
);
module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  postRegister,
  getLogout,
  forgetPasssword,
  postLogin,
  getLogin,
  showerror,
} = require("../controllers/auth.controller");

router.post("/register", postRegister);
router.post("/Userlogin", postLogin);

router.get("/logout", getLogout);
router.get("/login", getLogin);
router.get("/error", showerror);

router.patch("/users/forgetpassword", forgetPasssword);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    successRedirect: "/login", // Redirect to a success page
    failureRedirect: "/error", // Redirect to the home page or login page on failure
  })
);
module.exports = router;

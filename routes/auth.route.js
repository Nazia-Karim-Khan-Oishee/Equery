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

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  (req, res) => {
    res.redirect("/login");
  }
);

router.post("/register", postRegister);
router.post("/login", postLogin);

router.get("/logout", getLogout);
router.get("/login", getLogin);
router.get("/error", showerror);

router.patch("/users/forgetpassword/:id", forgetPasssword);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  postRegister,
  getLogout,
  forgetPasssword,
  postLogin,
  getLogin,
  showerror,
} = require("../controllers/auth.controller");

router.post("/register", postRegister);
router.post("/login", postLogin);

router.get("/logout", getLogout);
router.get("/login", getLogin);
router.get("/error", showerror);

router.patch("/users/forgetpassword/:id", forgetPasssword);

module.exports = router;

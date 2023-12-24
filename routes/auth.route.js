const express = require("express");
const router = express.Router();
const {
  postRegister,
  getLogout,
  putPasssword,
  postLogin,
  getLogin,
  showerror,
} = require("../controllers/auth.controller");

router.post("/register", postRegister);
router.get("/logout", getLogout);
router.post("/login", postLogin);
router.get("/login", getLogin);
router.get("/error", showerror);
router.put("/users/forgetpassword", putPasssword);

module.exports = router;

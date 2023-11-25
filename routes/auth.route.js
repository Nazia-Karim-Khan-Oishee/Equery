const express = require("express");
const router = express.Router();
const { postRegister } = require("../controllers/auth.controller");

router.post("/register", postRegister);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.json({ error: err });
    } else res.redirect("/");
  });
});

module.exports = router;

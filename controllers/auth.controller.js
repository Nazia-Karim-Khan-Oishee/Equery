const User = require("../datamodels/User.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");

const getLogout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.status(200).json({ msg: "Logged Out" });
      console.log("Succesfully logged out");
    }
  });
};
const postRegister = async (req, res, next) => {
  const { email, password } = req.body;
  const name = req.body.username;

  console.log(name);
  console.log(email);
  console.log(password);

  const errors = [];
  if (!name || !email || !password) {
    errors.push("All fields are required!");
  }
  // Basic email format validation using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Invalid email address format.");
  }
  // Password strength check
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  const isMinimumLength = password.length >= 5;

  if (
    !hasLowercase ||
    !hasUppercase ||
    !hasDigit ||
    !hasSpecialChar ||
    !isMinimumLength
  ) {
    errors.push(
      "Password must meet the following criteria:\n" +
        "- At least one lowercase letter\n" +
        "- At least one uppercase letter\n" +
        "- At least one digit\n" +
        "- At least one special character (@$!%*?&)\n" +
        "- Be at least 5 characters long"
    );
  }

  if (errors.length > 0) {
    console.log(errors);
    res.status(400).json({ error: errors });
  } else {
    // Create New User
    try {
      const user = await User.findOne({ email: email });

      if (user) {
        errors.push("User already exists with this email!");
        return res.status(400).json({ error: errors });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hash,
      });

      await newUser.save();

      console.log("Registration Successful");
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error during registration:", error);
      errors.push("Please try again");
      res.status(400).json({ error: errors });
    }
  }
};
const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/login",
    failureRedirect: "/error",
    failureFlash: true,
  })(req, res, next);
};
const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};
const showerror = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "error.html");
  res.sendFile(filePath);
};
module.exports = {
  postRegister,
  getLogout,
  postLogin,
  getLogin,
  showerror,
};

const User = require("../datamodels/User.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

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
const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect("/error");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      console.log("Login Request Received");
      console.log("Session:", req.session);
      res.redirect("/login");
    });
  })(req, res, next);
};

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

const showerror = async (req, res) => {
  // const filePath = path.join(__dirname, "..", "views", "error.html");
  res.status(400).json({ error: "Login Failed" });
};

const forgetPasssword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "No user with this email exists!!" });
    }

    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });

    const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;
    console.log(link);
    res.send("Link has been sent");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const reset_password = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  console.log(password);
  const oldUser = await User.findOne({ _id: id });

  if (!oldUser) {
    return res.json({ status: "User Do Not Exists!!" });
  }

  const secret = JWT_SECRET + oldUser.password;

  try {
    errors = [];

    const hasLowercase = /[a-z]/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const hasSpecialChar = /[@$!%*?&]/.test(newPassword);
    const isMinimumLength = newPassword.length >= 5;

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
      const verify = jwt.verify(token, secret);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      await User.updateOne(
        { _id: id },
        {
          $set: {
            password: hash,
          },
        }
      );
      res.json({ status: "password changed" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("Not Verified");
  }
};

module.exports = {
  postRegister,
  forgetPasssword,
  getLogout,
  postLogin,
  getLogin,
  showerror,
  reset_password,
};

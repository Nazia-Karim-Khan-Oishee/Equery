const User = require("../datamodels/User.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");

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
  passport.authenticate("local", {
    successRedirect: "/login",
    failureRedirect: "/error",
    failureFlash: true,
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
  const filePath = path.join(__dirname, "..", "views", "error.html");
  res.sendFile(filePath);
};

const putPasssword = async (req, res, next) => {
  errors = [];
  try {
    const userId = req.params.userId;
    const { newPassword } = req.body;

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

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (errors.length > 0) {
      console.log(errors);
      res.status(400).json({ error: errors });
    } else {
      // Hash the new password before saving it
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        console.log("No user found");
        return res.status(404).json({ error: "User not found" });
      }

      console.log("Password Updated: " + newPassword);

      res.json({ message: "Password updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  postRegister,
  getLogout,
  postLogin,
  getLogin,
  putPasssword,
  showerror,
};

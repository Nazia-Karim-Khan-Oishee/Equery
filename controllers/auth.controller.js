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

  if (errors.length > 0) {
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
      // You might want to redirect or send a success response here.
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error during registration:", error);
      errors.push("Please try again");
      res.status(400).json({ error: errors });
    }
  }
};

module.exports = {
  postRegister,
};

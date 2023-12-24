const User = require("../datamodels/User.model");
const path = require("path");
const bcrypt = require("bcrypt");

const updatePasssword = async (req, res, next) => {
  errors = [];
  try {
    // console.log(userId);

    const userId = req.user.id;
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

      console.log("Password Updated ");

      res.json({ message: "Password updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const postProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const photo = req.file.filename;

    const userId = req.user.id;
    const user = await User.findById(userId);
    console.log(user);

    if (photo) {
      user.profile_image = photo;
    }
    await user.save();

    res.json({ message: "Profile image updated successfully" });
  } catch (error) {
    console.log("Something went wrong");
    res.status(500).json({ error: error.message });
  }
};

const getProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.profile_image) {
      return res.status(404).json({ error: "Profile image not found" });
    }

    // Construct the path to the profile image
    const imagePath = path.resolve("uploads/images", user.profile_image);

    // Send the image file in the response
    console.log("Profile image of user with req.id: " + req.user.id);
    return res.sendFile(imagePath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUserName = async (req, res, next) => {
  // console.log(userId);

  const userId = req.user.id;
  const { name } = req.body;

  // Update the user's name in the database
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name: name },
    { new: true }
  );

  if (!updatedUser) {
    console.log("No user found");
    return res.status(404).json({ error: "User not found" });
  }

  console.log("Username Updated ");

  res.json({ message: "Username updated successfully" });
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  updatePasssword,
  postProfileImage,
  getProfileImage,
  updateUserName,
  getProfile,
};
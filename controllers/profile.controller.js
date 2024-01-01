const User = require("../datamodels/User.model");
const path = require("path");
const Resource = require("../datamodels/Resource.model");
const Question = require("../datamodels/Question.model");
const Comment = require("../datamodels/Comment.model");

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

    const imagePath = path.resolve("uploads/images", user.profile_image);

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

const updateProfilePicture = async (req, res, next) => {
  // console.log(userId);

  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }
  const photo = req.file.filename;

  // Update the user's name in the database
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profile_image: photo },
    { new: true }
  );

  if (!updatedUser) {
    console.log("No user found");
    return res.status(404).json({ error: "User not found" });
  }

  console.log("Profile picture Updated ");

  res.json({ message: "Profile picture successfully" });
};

const deleteProfileImage = async (req, res, next) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $unset: { profile_image: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found");
      res.json({ message: "Can not delete picture" });
    }

    console.log("Profile image deleted successfully");

    res.json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    throw error;
  }
};

const getResourcesByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userResources = await Resource.find({ uploader: userId });

    if (!userResources || userResources.length === 0) {
      return res
        .status(404)
        .json({ error: "No resources found for the user." });
    }

    console.log("Got Resources posted by the user");

    res.status(200).json(userResources);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getQuestionsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userQuestions = await Question.find({ uploaderId: userId });

    if (!userQuestions || userQuestions.length === 0) {
      return res
        .status(404)
        .json({ error: "No resources found for the user." });
    }

    const questionTexts = userQuestions.map((question) => question.text);

    console.log("Got Questions posted by the user");

    res.status(200).json(questionTexts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getCommentsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userComments = await Comment.find({ commenterId: userId });

    if (!userComments || userComments.length === 0) {
      return res.status(404).json({ error: "No Comments found for the user." });
    }

    const Comments = userComments.map((comment) => comment.comment);

    console.log("Got Comments posted by the user");

    res.status(200).json(Comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  updatePasssword,
  postProfileImage,
  getProfileImage,
  updateUserName,
  getProfile,
  updateProfilePicture,
  getResourcesByUser,
  getQuestionsByUser,
  deleteProfileImage,
  getCommentsByUser,
};

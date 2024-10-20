const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");

async function userSignupController(req, res) {
  try {
    const { email, password, name, phone } = req.body;

    // Validate input
    if (!email) throw new Error("Please provide the email.");
    if (!password) throw new Error("Please provide the password.");
    if (!name) throw new Error("Please provide the name.");
    if (!phone) throw new Error("Please provide the phone number.");

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) throw new Error("User already exists.");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    if (!hashPassword) throw new Error("Something went wrong during password hashing.");

    // Create payload and save new user
    const userData = new userModel({
      ...req.body,
      password: hashPassword,
    });

    const savedUser = await userData.save();

    res.status(201).json({
      data: savedUser,
      success: true,
      error: false,
      message: "User created successfully.",
    });

  } catch (error) {
    res.status(400).json({
      message: error.message || "An error occurred.",
      error: true,
      success: false,
    });
  }
}

module.exports = userSignupController;

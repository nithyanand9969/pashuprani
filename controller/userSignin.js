const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie"); // Import the cookie package

async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email) throw new Error("Please provide the email.");
    if (!password) throw new Error("Please provide the password.");

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User does not exist.");

    // Compare provided password with stored hashed password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials.");

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key", // Use environment variable for secret in production
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Set cookies for username and token
    res.setHeader('Set-Cookie', [
      cookie.serialize('username', email.split('@')[0], {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 60 * 60 * 24 * 7, // 1 week expiration
        path: '/', // Cookie available throughout the site
      }),
      cookie.serialize('token', token, {
        httpOnly: true, // Prevent client-side access
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 60 * 60, // 1 hour expiration
        path: '/', // Cookie available throughout the site
      }),
    ]);

    // Send response with username
    res.status(200).json({
      message: "Login successful.",
      success: true,
      error: false,
      token, // Send the token if needed for authentication in frontend
      username: email.split('@')[0], // Send the username to store in localStorage
    });
  } catch (error) {
    console.error("Login error:", error); // Log the error on the server side
    res.status(400).json({
      message: error.message || "An error occurred.",
      success: false,
      error: true,
    });
  }
}

module.exports = userLoginController;

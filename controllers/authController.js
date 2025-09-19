import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";

// User signup
export const signup = async (req, res) => {
  try {
    const {
      firstname,
      middlename,
      lastname,
      email,
      phone,
      password,
      confirmPassword,
      city,
      state,
      country,
      postalCode,
      dob,
      avatar,
      bio,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email or username already exists
    const emailExists = await User.findOne({ email });
   

    if (emailExists)
      return res.status(400).json({ message: "Email already exists" });
   

    const user = await User.create({
      firstname,
      middlename,
      lastname,
      email,
      phone,
      password,
      city,
      state,
      country,
      postalCode,
      dob,
      avatar,
      bio,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error in signup", error: err.message });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body; // username can be email or phone or username

    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }, { username: username }],
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = generateToken(user);

    // Create session
    req.session.user = { id: user._id, role: user.role };

    // Set cookie
    res.cookie("token", token, { httpOnly: true, secure: false });

    // Send response
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user_id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Error in login", error: err.message });
  }
};

// Admin signup
export const signupAdmin = async (req, res) => {
  try {
    const {
      firstname,
      middlename,
      lastname,
      username,
      email,
      phone,
      password,
      role,
      city,
      state,
      country,
      postalCode,
      dob,
      avatar,
      bio,
    } = req.body;

    // Validate role
    if (!["admin", "super_admin", "staff", "manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role for admin signup" });
    }

    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists)
      return res.status(400).json({ message: "Email already exists" });
    if (usernameExists)
      return res.status(400).json({ message: "Username already exists" });

    const user = await User.create({
      firstname,
      middlename,
      lastname,
      username,
      email,
      phone,
      password,
      role,
      city,
      state,
      country,
      postalCode,
      dob,
      avatar,
      bio,
    });

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in admin signup", error: err.message });
  }
};

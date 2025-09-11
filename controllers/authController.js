import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";

export const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ firstname, lastname, email, phone, password });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Error in signup", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body; // username can be email/phone

    const user = await User.findOne({ $or: [{ email: username }, { phone: username }] });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // JWT
    const token = generateToken(user);

    // Session
    req.session.user = { id: user._id, role: user.role };

    // Cookie
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Error in login", error: err.message });
  }
};


export const signupAdmin = async (req, res) => {
  console.log("Hi ");
  try {
    const { firstname, lastname, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ firstname, lastname, email, phone, password, role });

    res.status(201).json({ 
      message: "Admin created successfully", 
      user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Error in admin signup", error: err.message });
  }
};

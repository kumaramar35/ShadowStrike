import User from "../models/User.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "firstname lastname email phone"); 
 

    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};


// Get user by ID (only selected fields)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("firstname lastname email phone"); // 👈 Only fetch required fields

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// Update user (only allowed fields in response)
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // 🚫 Prevent password change here

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("firstname lastname email phone"); // ✅ Only return selected fields

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};


// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

// Change user role
export const changeUserRole = async (req, res) => {
  try { 
    const { role } = req.body;
    if (!["admin", "super_admin", "staff", "manager", "player", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });      
    res.json({ message: "User role updated successfully", user });
    } catch (err) {
    res.status(500).json({ message: "Error changing user role", error: err.message });
    }   
};


import BrandListUsers from "../models/BrandListUsers.js";

// ➡️ Create new user (Staff or Player)
export const createUser = async (req, res) => {
  try {
    const user = new BrandListUsers(req.body);
    await user.save();
    
    // remove password from response
    const { password, ...userData } = user.toObject();
    res.status(201).json({ message: "User created successfully.",  user: userData });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Failed to create user.", error: error.message });
  }
};

// ➡️ Read (list users by brand and optional role)
export const getUsersByRole = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.role = type.toLowerCase();

    const users = await BrandListUsers.find(filter)
      .select("_id username firstName lastName email role status createdAt")
      .lean();

    const numbered = users.map((u, i) => ({
      id: i + 1,        // serial number
      _id: u._id,       // keep original if needed
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    }));

    res.json(numbered);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
};


// ➡️ Get single user
export const getUserById = async (req, res) => {
  try {
    const user = await BrandListUsers.findById(req.params.id)
      .select("-password")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user.", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    if (update.password) {
      const bcrypt = await import("bcrypt");
      update.password = await bcrypt.hash(update.password, 10);
    }

    const user = await BrandListUsers.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User updated successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user.", error: error.message });
  }
};


// ➡️ Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BrandListUsers.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user.", error: error.message });
  }
};

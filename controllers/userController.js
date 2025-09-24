import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";
import BrandListUsers from "../models/BrandListUsers.js";
import Transaction from "../models/Transaction.js";
// import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "firstname lastname email phone");

    res.json({ count: users.length, users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstname lastname email phone"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("firstname lastname email phone");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (
      !["admin", "super_admin", "staff", "manager", "player", "user"].includes(
        role
      )
    ) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error changing user role", error: err.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {};
    if (type) {
      if (["staff", "player"].includes(type)) {
        filter.role = type;
      } else {
        return res.status(400).json({ message: "Invalid type" });
      }
    }

    const users = await User.find(filter).select("-password"); // exclude password
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

//  Start impersonation
export const impersonateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const targetUser = await User.findById(userId).populate("brandId");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Brand slug (for links)
    let brandSlug = targetUser.brandId ? targetUser.brandId.slug : null;
    const token = generateToken(targetUser, {
      isImpersonating: true,
      impersonatedBy: adminId,
    });

    // let brandSlug = null;
    if (targetUser.brandId) {
      const brand = targetUser.brandId; // already populated
      brandSlug = brand.slug;
    }
    const transactions = await Transaction.find({
      userId: targetUser._id,
      type: "withdrawal",
    });

    const settlement = transactions
      .filter((tx) => tx.status === "settled")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const amountReceived = transactions
      .filter((tx) => tx.status === "completed")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalWithdrawals = transactions.length;

    const usedWithdrawalLimit = transactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    const withdrawalLimit = targetUser.brandId?.maxWithdrawal || 0;
    const remainingWithdrawalLimit = Math.max(
      withdrawalLimit - usedWithdrawalLimit,
      0
    );

    res.json({
      message: `Impersonating ${targetUser.firstname}`,
      cardDeposits: brandSlug ? `/${brandSlug}/deposit` : null,
      Withdrawals: brandSlug ? `/${brandSlug}/withdraw` : null,

      dashboard: {
        settlement,
        amountReceived,
        totalWithdrawals,
        withdrawalLimit,
        usedWithdrawalLimit,
        remainingWithdrawalLimit,
      },

      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to impersonate user.", error: error.message });
  }
};

// Stop impersonation (return to admin)
export const stopImpersonation = async (req, res) => {
  try {
    const adminId = req.user.impersonatedBy || req.user._id;

    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const token = generateToken(adminUser);
    res.json({ message: "Stopped impersonation. Back to admin.", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to stop impersonation.", error: error.message });
  }
};

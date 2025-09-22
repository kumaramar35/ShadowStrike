import express from "express";
import {
  createUser,
  getUsersByRole,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/brandListUserController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin", "super_admin"),
  createUser
);

// Read
router.get(
  "/brand",
  isAuthenticated,
  authorizeRoles("admin", "super_admin"),
  getUsersByRole
);

router.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "super_admin"),
  getUserById
);

// Update
router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "super_admin"),
  updateUser
);

// Delete
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "super_admin"),
  deleteUser
);

export default router;

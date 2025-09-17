import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get user profile
router.get("/", isAuthenticated, getProfile);

// Update user profile
router.put("/", isAuthenticated, updateProfile);

export default router;

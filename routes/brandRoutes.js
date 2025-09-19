import express from "express";
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
} from "../controllers/brandController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Get all brands
router.get("/", isAuthenticated, authorizeRoles("admin", "super_admin"), getBrands);

// Get a single brand
router.get("/:id", isAuthenticated, authorizeRoles("admin", "super_admin"), getBrandById);

// Create brand
router.post("/", isAuthenticated, authorizeRoles("admin", "super_admin"), createBrand);

// Update brand
router.put("/:id", isAuthenticated, authorizeRoles("admin", "super_admin"), updateBrand);

export default router;

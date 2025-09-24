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

router.get("/", isAuthenticated, authorizeRoles("admin", "super_admin"), getBrands);
router.get("/:id", isAuthenticated, authorizeRoles("admin", "super_admin"), getBrandById);
router.post("/", isAuthenticated, authorizeRoles("admin", "super_admin"), createBrand);
router.put("/:id", isAuthenticated, authorizeRoles("admin", "super_admin"), updateBrand);

export default router;

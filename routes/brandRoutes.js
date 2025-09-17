import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getBrands, saveBrand } from "../controllers/brandController.js";

const router = express.Router();

router.get("/", isAuthenticated, authorizeRoles("admin", "super_admin"), getBrands);
router.post("/save", isAuthenticated, authorizeRoles("admin", "super_admin"), saveBrand);

export default router;

import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/", isAuthenticated, getProfile);


router.put("/", isAuthenticated, updateProfile);

export default router;

import express from "express";
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from "../controllers/userController.js";


import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Only super_admin can manage users
router.use(isAuthenticated, authorizeRoles("super_admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;

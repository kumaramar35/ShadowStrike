import express from "express";
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser ,
  listUsers,
  impersonateUser,
  stopImpersonation
} from "../controllers/userController.js";


import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Only super_admin can manage users
router.use(isAuthenticated, authorizeRoles("admin", "super_admin"));
router.get("/userList", listUsers);
router.post("/impersonate/:userId", impersonateUser);
router.post("/stop-impersonation", stopImpersonation);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);



export default router;

import express from "express";
import { signup, login, signupAdmin } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

//admin signuo route
//  router.post("/signup-admin", signupAdmin);

router.get("/admin", isAuthenticated, authorizeRoles("admin", "super_admin"), (req, res) => {
  res.json({ message: "Welcome Admins" });
});

router.get("/me", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

export default router;

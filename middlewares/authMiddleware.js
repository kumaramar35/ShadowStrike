import { verifyToken } from "../config/jwt.js";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try{
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });
     req.user = {
      id: decoded.id,
      role: decoded.role,
      isImpersonating: decoded.isImpersonating || false,
      impersonatedBy: decoded.impersonatedBy || null,
    };

    // (optional) If you want to always load user fresh
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid/expired token.", error: error.message });
  }
};

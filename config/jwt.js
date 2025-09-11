import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
export const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; 
        const user = verifyToken(token);
        if (user) {
            req.user = user;
            return next();
        }
    }
    return res.status(401).json({ message: 'Unauthorized' });
};  
export default { generateToken, verifyToken, jwtMiddleware };
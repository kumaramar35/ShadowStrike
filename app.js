import "./config/env.js"; // <-- MUST be first!

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/authRoutes.js";


connectDB();

const app = express();

// ✅ CORS Config
app.use(
  cors({
    origin: (origin, callback) => {
      // Postman / curl jaisi requests allow karne ke liye
      if (!origin) return callback(null, true);

      // ✅ Specific domains allowed
      const allowedOrigins = [
        "http://localhost:3000",    
        "http://localhost:5173" ,
        "http://localhost:3000"  ,           // Local frontend
        "https://your-frontend-app.onrender.com", // Render / Vercel frontend
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Cookies + sessions allowed
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(sessionConfig);

app.use("/api/auth", authRoutes);

export default app;

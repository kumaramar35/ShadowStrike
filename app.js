import "./config/env.js"; // <-- MUST be first!

import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/authRoutes.js";


connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(sessionConfig);

app.use("/api/auth", authRoutes);

export default app;

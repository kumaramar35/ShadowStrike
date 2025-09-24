import "./config/env.js"; 

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import coinRoutes from './routes/coinRoutes.js';
import transactionRoutes from "./routes/transactionRoutes.js";
import brandListUserRoutes from "./routes/brandListUserRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


//  CORS Config
// app.use(
//   cors({
//     origin: (origin, callback) => {
   
//       if (!origin) return callback(null, true);

  
//       const allowedOrigins = [
//         "http://localhost:3000",    
//         "http://localhost:5173" ,
//         "http://localhost:5174"  ,           
//         "https://your-frontend-app.onrender.com", 
//         "https://admin.shadowstrike.fun/",
//         "https://shadowstrike.fun/",
//       ];

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, 
//   })
// );
app.use(
  cors({
    origin: true,      // Allow requests from any origin
    credentials: true, // Allow cookies/auth headers with CORS
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(sessionConfig);

//  Serve static files like logo
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/coins",coinRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/brandList",brandListUserRoutes)
export default app;

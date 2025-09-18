import express from "express";
import { createTransaction, getTransactions, raiseDispute } from "../controllers/transactionController.js";
import { isAuthenticated  } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create new transaction
router.post("/", isAuthenticated , createTransaction);

// Get user transactions
router.get("/", isAuthenticated , getTransactions);

// Raise dispute
router.put("/:id/dispute", isAuthenticated , raiseDispute);

export default router;

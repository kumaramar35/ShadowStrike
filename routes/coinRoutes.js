import express from "express";
import Transaction from "../models/Transaction.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
const COIN_RATE = 1; // 1 Dollar = 1 Coin

// POST /api/coins/purchase
router.post("/purchase", isAuthenticated, async (req, res) => {
  try {
    let { coins, dollars, acceptTerms, acceptPricing, provider } = req.body;
    const userId = req.user._id;

    // ---- Validate Terms ----
    if (!acceptTerms || !acceptPricing) {
      return res
        .status(400)
        .json({ message: "You must accept terms and pricing" });
    }

    // ---- Convert coins ↔ dollars ----
    if (coins && !dollars) dollars = coins * COIN_RATE;
    if (dollars && !coins) coins = dollars / COIN_RATE;

    if (!coins || !dollars || coins <= 0 || dollars <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide valid coins or dollars" });
    }

    // ---- Create Transaction ----
    const transaction = await Transaction.create({
      transactionId: "TXN" + Date.now(),
      provider: provider || "PayPal", // default
      amountPaid: dollars,
      amountLoaded: coins,
      status: "Completed", // set "Pending" if you wait for webhook
      currency: "USD",
      userId,
    });

    res.status(201).json({
      message: "Purchase recorded successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

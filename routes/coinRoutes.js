
import express from "express";
const router = express.Router();

const COIN_RATE = 1; // 1 Dollar = 1 Coin

router.post("/purchase", (req, res) => {
  try {
    let { coins, dollars, acceptTerms, acceptPricing } = req.body;

    // Check Terms & Pricing
    if (!acceptTerms || !acceptPricing) {
      return res.status(400).json({ message: "You must accept terms and pricing" });
    }

    // If only coins provided → calculate dollars
    if (coins && !dollars) {
      dollars = coins * COIN_RATE;
    }

    // If only dollars provided → calculate coins
    if (dollars && !coins) {
      coins = dollars / COIN_RATE;
    }

    // Validation
    if (!coins || !dollars || coins <= 0 || dollars <= 0) {
      return res.status(400).json({ message: "Please provide valid coins or dollars" });
    }

    // Subtotal & Total (can later add tax/fees)
    const subtotal = dollars;
    const total = dollars;

    return res.status(200).json({
      message: "Purchase initiated successfully",
      data: {
        coins,
        dollars,
        subtotal,
        total,
        acceptTerms,
        acceptPricing,
        currency: "USD"
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error processing purchase", error: error.message });
  }
});

export default router;

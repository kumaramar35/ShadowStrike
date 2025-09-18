import Transaction from "../models/Transaction.js";

// @desc    Create new transaction
export const createTransaction = async (req, res) => {
  try {
    const { transactionId, provider, amountPaid, amountLoaded, status, receiptUrl } = req.body;

    const transaction = await Transaction.create({
      transactionId,
      provider,
      amountPaid,
      amountLoaded,
      status,
      receiptUrl,
      userId: req.user._id, // from JWT
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all transactions for logged-in user
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Raise dispute
export const raiseDispute = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    transaction.disputeRaised = true;
    await transaction.save();

    res.json({ message: "Dispute raised successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Admin: Get all transactions
export const getAllTransactions = async (req, res) => {
  try { 
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};
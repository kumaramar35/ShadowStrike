import Transaction from "../models/Transaction.js";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import path from "path";

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
      userId: req.user._id, 
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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

export const getAllTransactions = async (req, res) => {
  try { 
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};



export const getReceiptPdf = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    const receiptData = {
      receiptId: "#" + Math.floor(174684000 + Math.random() * 900000000),
      datePaid: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      username: tx.userId?.name || "Guest",
      status: tx.status || "Completed",
      loadAmount: tx.amountPaid || 0,
      totalPaid: tx.amountPaid || 0,
    };

    res.status(200).json({
      message: "Receipt fetched successfully",
      receipt: receiptData,
    });
  } catch (err) {
    console.error("Receipt fetch error:", err);
    res.status(500).json({ message: "Failed to fetch receipt data." });
  }
};

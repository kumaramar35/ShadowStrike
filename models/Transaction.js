import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  provider: {
    type: String,
    enum: ["PayPal", "Stripe", "PhonePe", "Razorpay", "Other"],
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  amountLoaded: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  status: {
    type: String,
    enum: ["Completed", "Pending", "Failed"],
    default: "Pending",
  },
  receiptUrl: {
    type: String, // file or link to PDF/HTML
  },
  disputeRaised: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;

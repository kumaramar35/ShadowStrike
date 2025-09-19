import Transaction from "../models/Transaction.js";
import { v4 as uuidv4 } from "uuid";

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

export const getReceipt = async (req, res) => {
  try {
    const txId = req.params.id;
    const tx = await Transaction.findById(txId).populate("userId", "name email");
    if (!tx) return res.status(404).send("<h2>Transaction not found</h2>");

    const invoiceNo = "RCPT-" + uuidv4().slice(0, 8).toUpperCase();
    const today = new Date();
    const logoUrl = `${req.protocol}://${req.get("host")}/public/logo.jpeg`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt ${invoiceNo}</title>
        <style>
          body { font-family: Arial, sans-serif; background:#f5f5f5; padding:20px; }
          .box { background:#fff; max-width:800px; margin:auto; padding:30px;
                 border:1px solid #ddd; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
          h1 { margin-top:0; color:#2c3e50; }
          table { width:100%; border-collapse:collapse; margin-top:25px; }
          th, td { border:1px solid #ddd; padding:8px; }
          th { background:#2c3e50; color:#fff; }
          .note { font-size:12px; color:#555; margin-top:25px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Payment Receipt</h1>
          <img src="${logoUrl}" alt="logo" style="height:45px"/>
          <p><b>Receipt No:</b> ${invoiceNo}</p>
          <p><b>Date:</b> ${today.toDateString()}</p>

          <p><b>User:</b> ${tx.userId?.name || "Guest"} (${tx.userId?.email || ""})</p>

          <table>
            <thead>
              <tr><th>#</th><th>Provider</th><th>Paid</th><th>Coins</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>${tx.provider}</td>
                <td>$${tx.amountPaid}</td>
                <td>${tx.amountLoaded}</td>
                <td>${tx.status}</td>
              </tr>
            </tbody>
          </table>

          <p><b>Total Paid:</b> $${tx.amountPaid}</p>

          <div class="note">
            This is a dummy receipt generated for testing.  
            All transactions are final once coins are credited.
          </div>
        </div>
      </body>
      </html>
    `;

    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>Error: ${err.message}</h3>`);
  }
};
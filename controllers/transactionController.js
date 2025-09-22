import Transaction from "../models/Transaction.js";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";

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

// controllers/transactionController.js

export const getReceiptPdf = async (req, res) => {
  try {
    const txId = req.params.id;
    const tx = await Transaction.findById(txId).populate("userId", "name email");
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    const invoiceNo = "RCPT-" + uuidv4().slice(0, 8).toUpperCase();
    const today = new Date();

    // Response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=receipt-${invoiceNo}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // Pipe the PDF directly to response
    doc.pipe(res);

    // ====== Header ======
    doc
      .fontSize(24)
      .fillColor("#2c3e50")
      .text("Payment Receipt", { align: "center" });

    doc.moveDown(0.5);

    const logoPath = "public/logo.jpeg"; // put your logo under /public
    try {
      doc.image(logoPath, doc.page.width / 2 - 25, doc.y, { fit: [50, 50] });
    } catch {
      // if logo not found, skip silently
    }
    doc.moveDown(2);

    // ====== Meta info ======
    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Receipt No: ${invoiceNo}`)
      .text(`Date: ${today.toDateString()}`)
      .moveDown(0.5);

    doc.text(
      `User: ${tx.userId?.name || "Guest"} (${tx.userId?.email || ""})`
    );

    doc.moveDown(1.5);

    // ====== Table header ======
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [40, 150, 100, 100, 80];

    doc
      .fontSize(12)
      .fillColor("#fff")
      .rect(tableLeft, tableTop, 470, 22)
      .fill("#2c3e50");

    doc
      .fillColor("#fff")
      .text("#", tableLeft + 5, tableTop + 5)
      .text("Provider", tableLeft + 40, tableTop + 5)
      .text("Paid", tableLeft + 190, tableTop + 5)
      .text("Coins", tableLeft + 290, tableTop + 5)
      .text("Status", tableLeft + 390, tableTop + 5);

    // ====== Table body ======
    const rowY = tableTop + 28;
    doc
      .fontSize(12)
      .fillColor("#000")
      .rect(tableLeft, rowY - 2, 470, 24)
      .stroke("#ddd");

    doc
      .text("1", tableLeft + 5, rowY + 2)
      .text(tx.provider, tableLeft + 40, rowY + 2)
      .text(`$${tx.amountPaid}`, tableLeft + 190, rowY + 2)
      .text(tx.amountLoaded, tableLeft + 290, rowY + 2)
      .text(tx.status, tableLeft + 390, rowY + 2);

    doc.moveDown(4);

    // ====== Total ======
    doc
      .fontSize(14)
      .fillColor("#2c3e50")
      .text(`Total Paid: $${tx.amountPaid}`, { align: "right" });

    doc.moveDown(2);

    // ====== Footer note ======
    // doc
    //   .fontSize(10)
    //   .fillColor("#555")
    //   .text(
    //     "This is a dummy receipt generated for testing purposes.\nAll transactions are final once coins are credited.",
    //     { align: "center" }
    //   );

    // Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

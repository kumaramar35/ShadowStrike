import Transaction from "../models/Transaction.js";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import path from "path";
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

    // --- PDF setup
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=receipt-${receiptData.receiptId}.pdf`
    );

    const margin = 50;
    const doc = new PDFDocument({ size: "A4", margin });
    doc.pipe(res);

    // Helper: row
    const addRow = (y, label, value, options = {}) => {
      const {
        size = 12,
        font = "Helvetica",
        labelColor = "#555",
        valueColor = "#000",
      } = options;
      doc.fontSize(size).font(font).fillColor(labelColor).text(label, margin, y);
      doc
        .fontSize(size)
        .font(font)
        .fillColor(valueColor)
        .text(value, margin, y, {
          align: "right",
          width: doc.page.width - margin * 2,
        });
    };
    const drawHr = (y) => {
      doc
        .strokeColor("#ddd")
        .moveTo(margin, y)
        .lineTo(doc.page.width - margin, y)
        .stroke();
    };

    // --- Logo (centered)
    const logoPath = path.join(process.cwd(), "public", "logo.jpeg");
    try {
      const logoWidth = 160;
      const logoHeight = 60;
      const centerX = doc.page.width / 2 - logoWidth / 2;
      doc.image(logoPath, centerX, 40, {
        fit: [logoWidth, logoHeight],
      });
    } catch (err) {
      console.error("Could not load logo. Is the path correct?", err);
    }
    doc.y = 120;

    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#000")
      .text("Payment Receipt", { align: "center" });
    doc.moveDown(3);

    // Receipt Details
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#555")
      .text("RECEIPT DETAILS", margin);
    doc.moveDown(1);
    addRow(doc.y, "Receipt ID", receiptData.receiptId);
    addRow(doc.y, "Date Paid", receiptData.datePaid);
    addRow(doc.y, "Username", receiptData.username);
    addRow(doc.y, "Status", receiptData.status);
    doc.moveDown(2);
 

    drawHr(doc.y);
       doc.moveDown(1);
    doc.moveDown(0.5);
    // Payment Summary
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#555")
      .text("PAYMENT SUMMARY", margin);
    doc.moveDown(1);
    addRow(doc.y, "Load Amount", `$${receiptData.loadAmount.toFixed(2)}`);
    doc.moveDown(1.5);

    drawHr(doc.y);
    doc.moveDown(0.5);

    addRow(doc.y, "Total Paid", `$${receiptData.totalPaid.toFixed(2)}`, {
      size: 14,
      font: "Helvetica-Bold",
      labelColor: "#000",
    });

    doc.moveDown(4);

    // Button
 const pageWidth = doc.page.width;
const btnMargin = 60; // leave some space on both sides
const btnWidth = pageWidth - btnMargin * 2; // dynamic width
const btnHeight = 45;
const btnX = btnMargin; // start after left margin
const btnY = doc.y;
    doc
      .roundedRect(btnX, btnY, btnWidth, btnHeight, 6)
      .fill("#4F46E5");
    doc
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("Print Receipt", btnX, btnY + 13, {
        width: btnWidth,
        align: "center",
      });

    // Footer (centered)
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#777")
      .text("Need help? Contact support@locknpay.com", margin, btnY + btnHeight + 35, {
        align: "center",
        width: doc.page.width - margin * 2,
      });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Failed to generate PDF receipt." });
  }
};
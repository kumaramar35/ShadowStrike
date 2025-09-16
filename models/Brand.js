import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  status: { type: Boolean, default: true },
  deposit: { type: String, default: "N/A" },
  withdrawal: { type: String, default: "N/A" },
  kycRequired: { type: Boolean, default: false },
  canDeposit: { type: Boolean, default: false },
  canWithdraw: { type: Boolean, default: false },
  canCryptoDeposit: { type: Boolean, default: false },
  canCashAppDeposit: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Brand', brandSchema);

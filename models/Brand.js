// import mongoose from 'mongoose';

// const brandSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String },
//   status: { type: Boolean, default: true },
//   deposit: { type: String, default: "N/A" },
//   withdrawal: { type: String, default: "N/A" },
//   kycRequired: { type: Boolean, default: false },
//   canDeposit: { type: Boolean, default: false },
//   canWithdraw: { type: Boolean, default: false },
//   canCryptoDeposit: { type: Boolean, default: false },
//   canCashAppDeposit: { type: Boolean, default: false }
// }, { timestamps: true });

// export default mongoose.model('Brand', brandSchema);


import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },

    status: { type: Boolean, default: true },
    deposit: { type: String, default: "N/A" },
    withdrawal: { type: String, default: "N/A" },

    // Permissions
    kycRequired: { type: Boolean, default: false },
    canDeposit: { type: Boolean, default: false },
    canWithdraw: { type: Boolean, default: false },
    canCryptoDeposit: { type: Boolean, default: false },
    canCashAppDeposit: { type: Boolean, default: false },

    // ----- Fees -----
    playerDepositFee: { type: Number, default: 0.13 },     // %
    playerWithdrawalFee: { type: Number, default: 0.10 },  // %
    brandDepositFee: { type: Number, default: 0.11 },      // %
    brandWithdrawalFee: { type: Number, default: 0.06 },   // %

    // ----- Transaction limits -----
    minDeposit: { type: Number, default: 5.00 },
    maxDeposit: { type: Number, default: 999.00},
    minWithdrawal: { type: Number, default: 25.00 },
    maxWithdrawal: { type: Number, default: 999.00 },
    withdrawalPercentage: { type: Number, default: 60 },

    // ----- Wallet -----
    availableBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },

    // Notes
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);

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


// models/Brand.js
import mongoose from "mongoose";
import slugify from "slugify";

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

    // slug and timezone
    slug: { type: String, unique: true, sparse: true },
    timezone: { type: String, default: "UTC" }, 

    // Fees
    playerDepositFee: { type: Number, default: 0 },
    playerWithdrawalFee: { type: Number, default: 0 },
    brandDepositFee: { type: Number, default: 0 },
    brandWithdrawalFee: { type: Number, default: 0 },

    // Limits
    minDeposit: { type: Number, default: 0 },
    maxDeposit: { type: Number, default: 0 },
    minWithdrawal: { type: Number, default: 0 },
    maxWithdrawal: { type: Number, default: 0 },
    withdrawalPercentage: { type: Number, default: 0 },

    // Wallet
    availableBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },

    notes: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

//automatic slug generation
brandSchema.pre("validate", async function (next) {
  if (this.name && !this.slug) {
    // base slug
    const base = slugify(this.name, { lower: true, strict: true });
    let candidate = base;
    let i = 0;

    // for uniqueness
    while (await mongoose.models.Brand.exists({ slug: candidate })) {
      i += 1;
      candidate = `${base}-${i}`;
    }
    this.slug = candidate;
  }


  if (!this.timezone) this.timezone = "UTC";

  next();
});

export default mongoose.model("Brand", brandSchema);

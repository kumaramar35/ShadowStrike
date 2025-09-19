import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    middlename: { type: String, trim: true }, // ✅ Added
    lastname: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: true,
    },
    city: { type: String, trim: true }, // ✅ Added
    state: { type: String, trim: true }, // ✅ Added
    country: { type: String, trim: true }, // ✅ Added
    postalCode: { type: String, trim: true }, // ✅ Added
    dob: { type: Date }, // ✅ Added
    avatar: { type: String, trim: true }, // ✅ Added - image URL
    bio: { type: String, trim: true }, // ✅ Added - short description
    password: { type: String, required: true },
    
    role: {
      type: String,
      enum: ["admin", "super_admin", "staff", "manager", "player", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);

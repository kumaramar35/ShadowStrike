import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    middlename: { type: String, trim: true }, 
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
    city: { type: String, trim: true }, 
    state: { type: String, trim: true }, 
    country: { type: String, trim: true }, 
    postalCode: { type: String, trim: true }, 
    dob: { type: Date }, 
    avatar: { type: String, trim: true }, 
    bio: { type: String, trim: true }, 
    password: { type: String, required: true},
    role: {
      type: String,
      enum: ["admin", "super_admin", "staff", "manager", "player", "user"],
      default: "user",
    },
     brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },
     status: { type: Boolean, default: true }
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);

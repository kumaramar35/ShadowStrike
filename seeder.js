import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js"; // Make sure this path is correct

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const seedUsers = async () => {
  try {
    const users = [
      {
        firstname: "Amit",
        lastname: "Admin",
        email: "admin@example.com",
        phone: "9999999999",
        password: "Password123",
        role: "admin"
      },
      {
        firstname: "Manoj",
        lastname: "Manager",
        email: "manager@example.com",
        phone: "8888888888",
        password: "Password123",
        role: "manager"
      },
      {
        firstname: "Ramesh",
        lastname: "Staff",
        email: "staff@example.com",
        phone: "7777777777",
        password: "Password123",
        role: "staff"
      },
      {
        firstname: "Rahul",
        lastname: "Player",
        email: "player@example.com",
        phone: "6666666666",
        password: "Password123",
        role: "player"
      }
    ];

    for (let u of users) {
      // Check if user already exists
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`${u.email} already exists`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);

      // Create user
      await User.create({ 
        ...u, 
        password: hashedPassword 
      });

      console.log(`${u.email} created successfully`);
    }

    console.log("✅ All users seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();

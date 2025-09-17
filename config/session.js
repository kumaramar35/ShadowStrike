import session from "express-session";
import MongoStore from "connect-mongo";

// console.log("🔍 MONGO_URI from .env:", process.env.MONGO_URI); // Debug log

if (!process.env.MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined. Check your .env file.");
}

export default session({
  secret: process.env.SESSION_SECRET || "defaultsecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 60 * 60, // 1 hour
  }),
  cookie: { maxAge: 1000 * 60 * 60 },
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import { db } from "./src/config/db_config.js";
import userRoutes from "./src/routes/userRoutes.js";
import listingRoutes from "./src/routes/listingRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
// app.use("/api/messages", messageRoutes);

// TEST DB CONNECTION
db.query("SELECT 1", (err) => {
  if (err) {
    console.log("DB connection failed ", err);
  } else {
    console.log("DB connected successfully ");
  }
});

app.listen(3000, () => {
  console.log("Server running on port " + 3000);
});
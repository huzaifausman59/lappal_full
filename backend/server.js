import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./src/routes/authRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import { db } from "./src/config/db_config.js";
import userRoutes from "./src/routes/userRoutes.js";
import listingRoutes from "./src/routes/listingRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import dealRoutes from "./src/routes/dealsRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ FIX 1: CLEAN & SAFE CORS ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://lappalfull.vercel.app"
].filter(Boolean); // removes undefined/null

// ---------------- SOCKET IO ----------------
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ---------------- EXPRESS CORS ----------------
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());

app.use(express.json());

// MAKE IO AVAILABLE
app.set("io", io);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/ai", aiRoutes);
app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.use("/conversations", messageRoutes);
app.use("/deals", dealRoutes);
app.use("/reviews", reviewRoutes);

// ---------------- SOCKET LOGIC ----------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  socket.on("typing", ({ conversationId, userId }) => {
    socket.to(`conversation_${conversationId}`).emit("typing", { userId });
  });

  socket.on("stop_typing", ({ conversationId, userId }) => {
    socket.to(`conversation_${conversationId}`).emit("stop_typing", { userId });
  });

  socket.on("send_message", (data) => {
    socket.to(`conversation_${data.conversationId}`).emit("receive_message", data);
  });

  socket.on("message_read", ({ conversationId, messageId, userId }) => {
    socket.to(`conversation_${conversationId}`).emit("message_read", {
      messageId,
      userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ---------------- DB TEST ----------------
db.query("SELECT 1", (err) => {
  if (err) {
    console.log("DB connection failed", err);
  } else {
    console.log("DB connected successfully");
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
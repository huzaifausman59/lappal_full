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

//  CREATE HTTP SERVER (IMPORTANT)
const server = http.createServer(app);

//  SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//  MAKE IO AVAILABLE EVERYWHERE
app.set("io", io);

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/conversations", messageRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/reviews", reviewRoutes);

//  SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN CHAT ROOM
  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  // TYPING INDICATOR
  socket.on("typing", ({ conversationId, userId }) => {
    socket.to(`conversation_${conversationId}`).emit("typing", {
      userId,
    });
  });

  socket.on("stop_typing", ({ conversationId, userId }) => {
    socket.to(`conversation_${conversationId}`).emit("stop_typing", {
      userId,
    });
  });

  // SEND MESSAGE (REALTIME BROADCAST)
  socket.on("send_message", (data) => {
    socket.to(`conversation_${data.conversationId}`).emit("receive_message", data);
  });

  // READ RECEIPT
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

// TEST DB CONNECTION
db.query("SELECT 1", (err) => {
  if (err) {
    console.log("DB connection failed ", err);
  } else {
    console.log("DB connected successfully ");
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
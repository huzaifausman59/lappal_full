import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createConversation } from "../controllers/messageController.js";

const router = express.Router();

router.post("/conversations", verifyToken, createConversation);

export default router;
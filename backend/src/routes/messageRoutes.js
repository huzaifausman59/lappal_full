import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createConversation,
         getConversations,
         getMessages,
         sendMessage,
         markAsRead} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", verifyToken, createConversation);

router.get("/", verifyToken, getConversations);

router.get("/:conversationId/messages", verifyToken, getMessages);

router.post("/:conversationId/messages", verifyToken, sendMessage);

router.put("/:conversationId/read", verifyToken, markAsRead);

export default router;
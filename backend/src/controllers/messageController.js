import {
  findOrCreateConversation,
  getConversationsModel,
  getMessagesModel,
  sendMessageModel,
  markAsReadModel
} from "../models/messageModel.js";

// CREATE CONVERSATION
export const createConversation = (req, res) => {
  const buyerId = req.user.id;
  const { seller_id, listing_id } = req.body;

  findOrCreateConversation(buyerId, seller_id, listing_id, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      conversationId: result.id,
      alreadyExists: result.exists,
    });
  });
};

// GET CONVERSATIONS
export const getConversations = (req, res) => {
  const userId = req.user.id;

  getConversationsModel(userId, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET MESSAGES
export const getMessages = (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.conversationId;

  getMessagesModel(conversationId, userId, (err, result) => {
    if (err) return res.status(500).json(err);

    if (!result) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    res.json(result);
  });
};

// SEND MESSAGE (REST + SOCKET BROADCAST)
export const sendMessage = (req, res) => {
  const io = req.app.get("io");

  const userId = req.user.id;
  const conversationId = req.params.conversationId;
  const { body } = req.body;

  if (!body?.trim()) {
    return res.status(400).json({ message: "Message body is required" });
  }

  sendMessageModel(conversationId, userId, body, (err, result) => {
    if (err) return res.status(500).json(err);

    if (!result) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const message = {
      id: result.insertId,
      sender_id: userId,
      body,
      sent_at: new Date(),
    };

    //  SOCKET BROADCAST
    io.to(`conversation_${conversationId}`).emit(
      "receive_message",
      message
    );

    res.json(message);
  });
};

// MARK AS READ
export const markAsRead = (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.conversationId;

  markAsReadModel(conversationId, userId, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Messages marked as read" });
  });
};
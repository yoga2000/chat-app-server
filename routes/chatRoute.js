const express = require("express");
const {
  joinChat,
  sendMessage,
  getChatRoomMessages,
} = require("../controller/chatController");
const { authenticateToken } = require("../middleware/authToken");
const router = express.Router();

router.post("/join/chat", authenticateToken, joinChat);
router.post("/send/message", sendMessage);
router.get("/get/messages/:chat_id", getChatRoomMessages);

module.exports = router;

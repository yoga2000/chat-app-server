const mongoose = require("mongoose");

const unreadCountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  unreadCount: { type: Number, default: 0 },
  lastReadAt: { type: Date, default: Date.now },
});

const unreadMessageModel = mongoose.model("UnreadCount", unreadCountSchema);

module.exports = unreadMessageModel;

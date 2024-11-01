const mongoose = require("mongoose");

const { Schema } = mongoose;

const chatRoomSchema = new Schema(
  {
    room: { type: String, default: null }, 
    participants: [{ type: String, required: true }],
    isGroupChat: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;

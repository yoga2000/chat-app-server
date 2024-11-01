const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");
const unreadMessageModel = require("../models/unreadMessageModel");
const { User } = require("../models/users");

// const saveMessage = async (sender_id, content, chat_id, receiverId, socket) => {
//   const chatRoom = await ChatRoom.findById(chat_id);
//   if (!chatRoom) {
//     console.log("chat room not found");
//     return;
//   }

//   // find that the receiver is online

//   const usr = await User.findOne({ _id: receiverId });
//   if (usr.status === "online") {
//     try {
//       const message = new Message({
//         senderId: sender_id,
//         message: content,
//         chatRoomId: chat_id,
//       });
//       await message.save();

//       await ChatRoom.findByIdAndUpdate(chat_id, {
//         lastMessage: message._id,
//         updatedAt: new Date(),
//       });

//       return;
//     } catch (error) {
//       console.log(error);
//     }
//   } else {
//     try {
//       const unreadMsg = await unreadMessageModel.findOne({ userId: sender_id, roomId: chat_id });
//       if (!unreadMsg || unreadMsg.length === 0) {
//         const unreadMessage = new unreadMessageModel({
//           userId: sender_id,
//           roomId: chat_id,
//           unreadCount: 1,
//         });
//         await unreadMessage.save();
//       } else {
//         await unreadMessageModel.findOneAndUpdate(
//           { userId: receiverId, roomId: chat_id },
//           {
//             unreadCount: unreadMsg.unreadCount + 1,
//           }
//         );
//       }

//       // save the message

//       const message = new Message({
//         senderId: sender_id,
//         message: content,
//         chatRoomId: chat_id,
//       });
//       await message.save();

//       await ChatRoom.findByIdAndUpdate(chat_id, {
//         lastMessage: message._id,
//         updatedAt: new Date(),
//       });
//     } catch (error) {
//       throw error;
//     }
//   }
// };

const saveMessage = async (sender_id, content, chat_id, receiverId, socket) => {
  try {
    const chatRoom = await ChatRoom.findById(chat_id);
    if (!chatRoom) {
      console.log("Chat room not found");
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      console.log("Receiver not found");
      return;
    }

    // Check if the receiver is online
    const message = new Message({
      senderId: sender_id,
      message: content,
      chatRoomId: chat_id,
    });

    await message.save();

    await ChatRoom.findByIdAndUpdate(chat_id, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    if (receiver.status === "online") {
      console.log("Receiver is online. Message sent directly.");
      return;
    }

    // Receiver is offline, update unread count
    const unreadMsg = await unreadMessageModel.findOne({ userId: sender_id, roomId: chat_id });

    if (!unreadMsg) {
      // No unread messages document found for this room and user, create one
      const newUnreadMessage = new unreadMessageModel({
        userId: sender_id,
        roomId: chat_id,
        unreadCount: 1,
      });
      await newUnreadMessage.save();
    } else {
      // Update unread count for the existing unread message document
      unreadMsg.unreadCount += 1;
      await unreadMsg.save();
    }
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

module.exports = { saveMessage };

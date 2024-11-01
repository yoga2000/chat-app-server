const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");
const unreadMessageModel = require("../models/unreadMessageModel");
const { User } = require("../models/users");
const roomIdCreationName = require("../utils/roomIdCreation");
const convertISOTo12Hour = require("../utils/timeChange");

// const joinChat = async (req, res) => {
//   const { receiverId } = req.body;
//   const { email } = req.user;

//   // Validate receiverId
//   if (!receiverId) {
//     return res.status(400).json({ message: "receiverId is required" });
//   }

//   const receiver = await User.findOne({ empId: receiverId }).select("-password");

//   // Find the current user
//   let user;
//   try {
//     user = await User.findOne({ email });
//   } catch (error) {
//     console.error("Error finding user:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const senderId = user.empId;

//   // Check if the chat room exists
//   let chat;
//   try {
//     chat = await ChatRoom.findOne({
//       participants: { $all: [user._id, receiver._id] },
//       isGroupChat: false,
//     });
//     // const userIds = [user._id, receiver._id];
//     // const clearMsg = await unreadMessageModel.find({
//     //   roomId: chat._id,
//     //   userId: { $in: userIds },
//     // });

//     // if (clearMsg.length > 0) {
//     //   // Delete all unread messages for both users in the specified chat room
//     //   await unreadMessageModel.deleteMany({
//     //     roomId: chat._id,
//     //     userId: { $in: userIds },
//     //   });
//     // }

//     const usrId = user._id;
//     const unreadMsg = await unreadMessageModel.findOne({
//       roomId: chat._id,
//       userId: usrId,
//     });
//     if (unreadMsg) {
//       unreadMsg.unreadCount = 0;
//       unreadMsg.lastReadAt = new Date();
//       await unreadMsg.save();
//     } else {
//       const newUnreadMsg = new unreadMessageModel({
//         roomId: chat._id,
//         userId: usrId,
//         unreadCount: 0,
//         lastReadAt: new Date(),
//       });
//       await newUnreadMsg.save();
//     }
//     console.log(chat, "chat");
//     if (chat) {
//       return res.status(200).json({
//         message: `User has joined ${chat.room}`,
//         roomDetail: chat,
//         receiverDetail: receiver,
//         userDetail: user,
//       });
//     }
//   } catch (error) {
//     console.error("Error finding chat room:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }

//   // Create a new chat room if it doesn't exist
//   if (!chat) {
//     try {
//       const room = await roomIdCreationName([senderId, receiverId]);
//       const newChatRoom = new ChatRoom({
//         room: room,
//         participants: [user._id, receiver._id],
//       });

//       await newChatRoom.save();
//       return res.status(201).json({
//         message: "success",
//         roomDetail: newChatRoom,
//         receiverDetail: receiver,
//         userDetail: user,
//       });
//     } catch (error) {
//       console.error("Error creating chat room:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   } else {
//     return res.status(200).json({
//       message: `User has joined ${chat.room}`,
//       roomDetail: chat,
//       receiverDetail: receiver,
//       userDetail: user,
//     });
//   }
// };

// message send

// sender_id,
// content,
// chat_room_id

const joinChat = async (req, res) => {
  const { receiverId } = req.body;
  const { email } = req.user;

  // Validate receiverId
  if (!receiverId) {
    return res.status(400).json({ message: "receiverId is required" });
  }

  // Find the receiver
  const receiver = await User.findOne({ empId: receiverId }).select("-password");
  if (!receiver) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  // Find the current user
  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  const senderId = user.empId;

  // Check if the chat room exists
  let chat;
  try {
    chat = await ChatRoom.findOne({
      participants: { $all: [user._id, receiver._id] },
      isGroupChat: false,
    });

    const usrId = receiver._id;
    if (chat) {
      // Reset unread messages for the user in this chat room
      const unreadMsg = await unreadMessageModel.findOne({
        roomId: chat._id,
        userId: usrId,
      });

      if (unreadMsg) {
        unreadMsg.unreadCount = 0;
        unreadMsg.lastReadAt = new Date();
        await unreadMsg.save();
      } else {
        const newUnreadMsg = new unreadMessageModel({
          roomId: chat._id,
          userId: usrId,
          unreadCount: 0,
          lastReadAt: new Date(),
        });
        await newUnreadMsg.save();
      }

      return res.status(200).json({
        message: `User has joined ${chat.room}`,
        roomDetail: chat,
        receiverDetail: receiver,
        userDetail: user,
      });
    }
  } catch (error) {
    console.error("Error finding chat room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  // Create a new chat room if it doesn't exist
  if (!chat) {
    try {
      const room = await roomIdCreationName([senderId, receiverId]);
      const newChatRoom = new ChatRoom({
        room: room,
        participants: [user._id, receiver._id],
      });

      await newChatRoom.save();
      return res.status(201).json({
        message: "success",
        roomDetail: newChatRoom,
        receiverDetail: receiver,
        userDetail: user,
      });
    } catch (error) {
      console.error("Error creating chat room:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const sendMessage = async (req, res) => {
  const { sender_id, content, chat_room_id } = req.body;

  const chatRoom = await ChatRoom.findById(chat_room_id);
  console.log(chatRoom);
  if (!chatRoom) {
    return res.status(404).json({ message: `chat room not found`, result: chatRoom });
  }

  try {
    const message = new Message({
      senderId: sender_id,
      message: content,
      chatRoomId: chat_room_id,
    });
    await message.save();

    await ChatRoom.findByIdAndUpdate(chat_room_id, {
      lastMessage: Message._id,
      updatedAt: new Date(),
    });
    return res.status(201).json({ message: "message sent", result: message });
  } catch (error) {
    return res.status(500).json({ message: `internal server error`, result: error.message });
  }
};

// get single chat room message

const getChatRoomMessages = async (req, res) => {
  const { chat_id } = req.params;

  try {
    const messages = await Message.find({ chatRoomId: chat_id });

    const formattedMessages = await Promise.all(
      messages.map(async (message) => ({
        _id: message._id,
        senderId: message.senderId,
        message: message.message,
        createdAt: await convertISOTo12Hour(message.createdAt),
      }))
    );

    return res.status(200).json({ message: "success", data: formattedMessages });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { joinChat, sendMessage, getChatRoomMessages };

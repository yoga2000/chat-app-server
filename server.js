const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const { dbConnection } = require("./utils/db");
dotenv.config();

const { saveSocketIdAndStatus } = require("./utils/socketFunctions");
app.use(cookieParser());
app.use(express.json());
const corsOptions = {
  origin: ["https://chatflick.netlify.app"],
  credentials: true,
};
app.use(cors(corsOptions));

// db connection
dbConnection();

const io = require("socket.io")(server, {
  cors: {
    origin: ["https://chatflick.netlify.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//socket logics

io.on("connection", async (socket) => {
  const userEmail = socket.handshake.query.email; // Get the current user email
  const status = "online";
  const usr = await saveSocketIdAndStatus(userEmail, socket.id, status);

  socket.on("user_online", (data) => {
    console.log("suooo");
    socket.broadcast.emit("online", data);
  });

  socket.on("join-user", (data) => {
    socket.join(data);
    console.log(socket.id + " joined room " + data);
  });

  socket.on("typing", (data) => {
    const { roomId, name } = data;
    socket.to(roomId).emit("typing", `${name} is typing...`);
  });

  socket.on("send-message", async (data) => {
    const { message, roomId, senderId, receiverId, room, receiverEmail } = data;

    await saveMessage(senderId, message, roomId, receiverId, socket);
    const time = new Date();
    const createdAt = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    io.in(socket.room).to(roomId).emit("receive-message", {
      message,
      roomId,
      senderId,
      room,
      createdAt,
    });
  });
  socket.on("join_room", (room) => {
    const { roomId, userId } = room;
    socket.join(roomId);
  });

  socket.on("leave_user", (data) => {
    socket.broadcast.emit("user_offline", data);
  });

  socket.on("disconnect", async () => {
    const userEmail = socket.handshake.query.email;
    const status = "offline";
    const usr = await saveSocketIdAndStatus(userEmail, null, status);
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the chat app");
});

//Routes
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const { User } = require("./models/users");
const { saveMessage } = require("./utils/saveMessage");
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

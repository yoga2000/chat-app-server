import React, { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { UserContext } from "../context/userContext";
import { socket } from "../../socket";

import "../helpers/messageBubble.css";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const { roomData, getMessages, messagesData, setMessagesData, getUsers } = useContext(UserContext);
  console.log(messagesData, "messages");
  const [typing, setTyping] = useState(null);

  useEffect(() => {
    if (roomData.roomDetail) {
      getMessages(roomData.roomDetail?._id);
    }
    getUsers();

    socket.on("receive-message", (data) => {
      setMessagesData((prevData) => ({
        ...prevData,
        data: [...prevData.data, data],
      }));
    });
    socket.on("typing", (data) => {
      setTyping(data);
      setTimeout(() => setTyping(null), 3000);
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
    };
  }, [roomData]);

  useEffect(() => {
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messagesData.data]);

  const emitMessage = () => {
    if (message.trim() === "") return; //

    const data = {
      message,
      roomId: roomData.roomDetail?._id,
      room: roomData.roomDetail?.room,
      senderId: roomData.userDetail?._id,
      receiverId: roomData.receiverDetail?._id,
      receiverEmail: roomData.receiverDetail?.email,
    };
    socket.emit("send-message", data);
    setMessage("");
    console.log("emitted");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      emitMessage();
    }
  };
  const onChangeHandler = (e) => {
    const data = {
      roomId: roomData.roomDetail?._id,
      name: roomData.userDetail.name,
    };
    socket.emit("typing", data);
    setMessage(e.target.value);
  };
  return (
    <div className="relative ">
      {/* top bar */}
      <div className="flex  bg-[#2a3942] text-gray-200 items-center justify-between p-2">
        <div className="flex  gap-x-2 items-center">
          <CgProfile className="text-4xl " />
          <p className="text-lg">{roomData.receiverDetail?.name}</p>
          {typing && <div className="p-2 text-gray-400 italic">{typing}</div>}
        </div>
        <div className="flex gap-x-4 items-center cursor-pointer">
          <CiSearch className="text-2xl" />
          <BsThreeDotsVertical className="text-2xl " />
        </div>
      </div>
      {/* message body */}
      <div className="text-gray-200 h-[490px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#111b21] scrollbar-track-gray-500 chat-messages">
        {messagesData.data &&
          messagesData.data.map((message) => (
            <div key={message._id || Math.random()} className={`p-2 flex ${message.senderId === roomData.userDetail?._id ? "justify-end" : "justify-start"}`}>
              <div className={`message-bubble ${message.senderId === roomData.userDetail?._id ? "bg-green-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                {message.message}
                <span className="text-xs  px-2 ">{message.createdAt}</span>
              </div>
            </div>
          ))}
      </div>

      {/* {inputBar} */}
      <div className="absolute shadow-md  flex items-center mx-auto  top-[544px]  bg-[#202c33]  px-4  py-2 w-full ">
        <input
          type="text"
          className="w-[90%] p-2   rounded-l-md  bg-[#2a3942] text-gray-200 rounded-sm  focus:outline-none"
          name=""
          placeholder="Type a message"
          id=""
          onChange={onChangeHandler}
          onKeyDown={handleKeyDown}
          value={message}
        />
        <div className=" bg-green-500 p-2 px-4 rounded-r-md" onClick={emitMessage}>
          <IoIosSend className="text-gray-300  text-2xl  cursor-pointer " />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

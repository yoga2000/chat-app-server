import React, { useContext } from "react";
import Sidebar from "../helpers/Sidebar";
import ChatBox from "../helpers/ChatBox";
import { UserContext } from "../context/userContext";
import ChatBoxPlaceholder from "./ChatBox";

const Chat = () => {
  const { roomData } = useContext(UserContext);
  return (
    <div className=" md:h-screen bg-black">
      <div className=" flex  flex-col  justify-between gap-4 md:grid grid-cols-1  p-8    lg:grid-cols-3 ">
        <div className=" h-[600px] shadow-md bg-[#111b21] text-gray-200 overflow-y-auto   scrollbar-thin scrollbar-thumb-[#111b21] scrollbar-track-gray-500 ">
          <Sidebar />
        </div>
        <div className=" h-[600px] shadow-md relative bg-custom-pattern bg-[color:#0B141A] bg-33  overflow-y-auto lg:col-span-2">
          {roomData.length !== 0 ? <ChatBox /> : <ChatBoxPlaceholder />}
        </div>
      </div>
    </div>
  );
};
export default Chat;

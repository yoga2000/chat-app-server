import React from "react";
import { CgProfile } from "react-icons/cg"; // For an optional user icon

const ChatBoxPlaceholder = () => {
  return (
    <div className="h-[600px] shadow-md relative bg-[#0B141A] flex flex-col items-center justify-center text-center text-gray-400 lg:col-span-2">
      <CgProfile className="text-6xl text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-300">
        Connect with a User
      </h2>
      <p className="text-gray-400 mt-2">
        Select a user from the sidebar to start chatting.
      </p>
    </div>
  );
};

export default ChatBoxPlaceholder;

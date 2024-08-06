import React, { useState } from "react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";
import { FaBars } from "react-icons/fa";

const ChatWindow = ({ activeUser, messages, sendMessage }) => {
  const [showOptions, setShowOptions] = useState(false);

  if (!activeUser) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-900 p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={activeUser.image || "default-avatar.png"}
            alt={activeUser.name}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <p className="text-white">{activeUser.name}</p>
            <p className="text-gray-400 text-sm">Online</p>
          </div>
        </div>
        <div className="relative">
          <FaBars
            className="text-white cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          />
          {showOptions && (
            <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg p-2 w-48">
              <p className="text-white cursor-pointer">Option 1</p>
              <p className="text-white cursor-pointer">Option 2</p>
              <p className="text-white cursor-pointer">Option 3</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages && messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
      </div>
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;

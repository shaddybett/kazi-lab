import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io"; // Back arrow for mobile
import { Avatar } from "flowbite-react";
import './Chat.css';

const ChatWindow = ({ activeUser, messages, sendMessage, detailss, receiver, setActiveUser, onClose }) => {
  const chatRef = useRef(null);

  if (!activeUser) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div
      className=" flex-grow bg-gray-900 p-4 flex flex-col justify-between"
      ref={chatRef}
    >
      {/* Back arrow for mobile */}
      <div className="flex items-center justify-between mb-4 bg-gray-600 rounded-sm ">
        <div className="flex items-center">
          {/* Show the back arrow only on mobile */}
          <IoMdArrowBack
            className="text-white text-3xl cursor-pointer lg:hidden"
            onClick={() => setActiveUser(null)}
          />
          <Avatar
            img={activeUser.image}
            rounded
            alt={activeUser.name}
            className="w-12 ml-2 h-12 rounded-full mr-3"
          />
          <div>
            <p className="text-white">
              {activeUser.name || `${receiver.first_name} ${receiver.last_name}`}
            </p>
            {/* <p className="text-gray-400 text-sm">Online</p> */}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages &&
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} senderId={activeUser.id} />
          ))}
      </div>

      {/* Message Input */}
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;

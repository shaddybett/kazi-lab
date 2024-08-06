import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import MessageInput from "../Chat/MessageInput";
import MessageBubble from "../Chat/MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";
import { FaBars } from "react-icons/fa";

const ChatBox = ({ senderId, receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchMessages();
  }, [receiver]);

  useEffect(() => {
    const storedSenderId = localStorage.getItem("selectedSenderId");
    if (storedSenderId) {
      setSelectedSenderId(storedSenderId);
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${backendUrl}/get_messages/${receiver.id}`);
      if (response.ok) {
        const responseData = await response.json();
        setMessages(responseData);
        groupMessagesBySender(responseData);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const groupMessagesBySender = (messages) => {
    const grouped = messages.reduce((acc, msg) => {
      if (!acc[msg.sender_id]) {
        acc[msg.sender_id] = [];
      }
      acc[msg.sender_id].push(msg);
      return acc;
    }, {});
    setGroupedMessages(grouped);
  };

  const handleSendMessage = async (messageContent) => {
    try {
      const response = await fetch(`${backendUrl}/send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiver.id,
          content: messageContent,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSenderClick = (senderId) => {
    setSelectedSenderId(senderId);
    localStorage.setItem("selectedSenderId", senderId);
  };

  if (!receiver) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="chat-box flex-grow bg-gray-900 p-4 flex flex-col justify-between">
      <Card>
        <div className="chat-header flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={receiver.image || "default-avatar.png"}
              alt={receiver.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <p className="text-white">{receiver.name}</p>
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
        <div className="chat-body flex-1 overflow-y-auto mb-4">
          <div className="sender-list flex mb-4">
            {Object.keys(groupedMessages).map((senderId) => (
              <button
                key={senderId}
                onClick={() => handleSenderClick(senderId)}
                className="sender-id bg-gray-800 text-white p-2 rounded mr-2"
              >
                Sender {senderId}
              </button>
            ))}
          </div>
          <div className="message-list">
            {selectedSenderId &&
              groupedMessages[selectedSenderId] &&
              groupedMessages[selectedSenderId].map((msg, index) => (
                <MessageBubble key={index} message={msg}/>
              ))}
          </div>
        </div>
        <MessageInput sendMessage={handleSendMessage} />
      </Card>
    </div>
  );
};

export default ChatBox;

import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";

const ChatBox = ({ senderId, receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchMessages();
  }, [receiver]);

  useEffect(() => {
    const storedSenderId = localStorage.getItem('selectedSenderId');
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

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`${backendUrl}/send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiver.id,
          content: newMessage,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSenderClick = (senderId) => {
    setSelectedSenderId(senderId);
    localStorage.setItem('selectedSenderId', senderId);
  };

  return (
    <div className="chat-box">
      <Card>
        <div className="chat-header">
          <h3>
            Chat with {receiver.first_name} {receiver.last_name}
          </h3>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="chat-body">
          <div className="sender-list">
            {Object.keys(groupedMessages).map((senderId) => (
              <button
                key={senderId}
                onClick={() => handleSenderClick(senderId)}
                className="sender-id"
              >
                Sender {senderId}
              </button>
            ))}
          </div>
          <div className="message-list">
            {selectedSenderId &&
              groupedMessages[selectedSenderId] &&
              groupedMessages[selectedSenderId].map((msg) => (
                <div key={msg.id} className="chat-message">
                  <p className="text-black">
                    <strong className="text-black">{msg.sender_id}</strong>{" "}
                    {msg.content}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </Card>
    </div>
  );
};

export default ChatBox;

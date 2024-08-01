import React, { useState, useEffect } from "react";

const ChatBox = ({ senderId, receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, [receiver.id]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/get_messages/${senderId}/${receiver.id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/send_message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: senderId,
            receiver_id: receiver.id,
            content: newMessage,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setNewMessage("");
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>Chat with {receiver.first_name} {receiver.last_name}</h3>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="chat-body">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <p><strong>{msg.sender_id === senderId ? "You" : receiver.first_name}:</strong> {msg.content}</p>
          </div>
        ))}
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
    </div>
  );
};

export default ChatBox;

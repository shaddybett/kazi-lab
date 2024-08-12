import React, { useState, useEffect } from "react";
import Sidebar from "../Chat/SideBar";
import ChatWindow from "../Chat/ChatWindow";

const ChatBox = ({ senderId, receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (receiver) {
      fetchMessages(senderId, receiver.id);
    }
  }, [receiver, senderId]);

  const fetchMessages = async (senderId, receiverId) => {
    if (!senderId || !receiverId) {
      console.error("Missing senderId or receiverId");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/get_messages_between/${senderId}/${receiverId}`);
      if (response.ok) {
        const responseData = await response.json();
        setMessages(responseData);
        const userIds = extractUserIds(responseData);
        fetchUserDetails(userIds);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const extractUserIds = (messages) => {
    const userIds = new Set();
    messages.forEach((msg) => {
      userIds.add(msg.sender_id);
      userIds.add(msg.receiver_id);
    });
    return Array.from(userIds);
  };

  const fetchUserDetails = async (userIds) => {
    setLoading(true);
    try {
      const requests = userIds.map((userId) =>
        fetch(`${backendUrl}/details/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      const responses = await Promise.all(requests);

      const detailsData = await Promise.all(
        responses.map((response) => {
          if (response.ok) return response.json();
          return null;
        })
      );

      const newDetails = detailsData.reduce((acc, detail, index) => {
        if (detail) acc[userIds[index]] = detail;
        return acc;
      }, {});

      setDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
    } catch (error) {
      setError("An error occurred, please try again later");
    }
    setLoading(false);
  };

  const handleSendMessage = async (messageContent) => {
    const receiverId = receiver ? receiver.id : localStorage.getItem("senders_id");

    if (!receiverId) {
      console.error("Receiver ID is missing");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiverId,
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchMessages(senderId, receiverId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="flex h-full">
      <Sidebar
        contacts={Array.from(new Set(messages.map(msg => msg.sender_id === senderId ? msg.receiver_id : msg.sender_id)))
          .map(contactId => ({
            id: contactId,
            name: details[contactId]
              ? `${details[contactId].first_name} ${details[contactId].last_name}`
              : "Unknown User",
            status: "Online",
            message: messages.find(msg => msg.sender_id === contactId || msg.receiver_id === contactId)?.content,
            image: details[contactId] ? details[contactId].image : null,
          }))}
        setActiveUser={(user) => fetchMessages(senderId, user.id)}
      />
      <ChatWindow
        activeUser={receiver}
        messages={sortedMessages}
        sendMessage={handleSendMessage}
      />
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ChatBox;

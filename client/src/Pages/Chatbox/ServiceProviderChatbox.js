import React, { useState, useEffect } from "react";
import Sidebar from "../Chat/SideBar";
import ChatWindow from "../Chat/ChatWindow";

const ServiceProviderChatBox = ({ providerId }) => {
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchMessages(providerId);
  }, [providerId]);

  const fetchMessages = async (receiverId) => {
    // console.log("receiveridiisjs:",receiverId.id)
    try {
      const response = await fetch(`${backendUrl}/get_messages_for_receiver/${receiverId}`);
      if (response.ok) {
        const responseData = await response.json();
        console.log("Messages fetched: ", responseData);
        setMessages(responseData);
        const userIds = extractUserIds(responseData);
        fetchUserDetails(userIds);
        groupMessagesBySender(responseData);
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

      console.log("User details fetched: ", newDetails);
      setDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
    } catch (error) {
      setError("An error occurred, please try again later");
    }
    setLoading(false);
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

  const handleSendMessage = async (messageContent, senderId) => {
    if (!senderId) {
      console.error("Sender ID is missing");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: providerId,
          receiver_id: senderId, 
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchMessages(providerId);  // Fetch updated messages after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar
        contacts={Object.keys(groupedMessages).map((senderId) => ({
          id: senderId,
          name: details[senderId]
            ? `${details[senderId].first_name} ${details[senderId].last_name}`
            : "Unknown User",
          status: "Online",
          message: groupedMessages[senderId][0].content,
          image: details[senderId] ? details[senderId].image : null,
        }))}
        setActiveUser={setActiveUser}
      />
      <ChatWindow
        activeUser={activeUser}
        messages={activeUser ? groupedMessages[activeUser.id] : []}
        sendMessage={(messageContent) => handleSendMessage(messageContent, activeUser.id)}
      />
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ServiceProviderChatBox;

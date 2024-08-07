import React, { useState, useEffect } from "react";
import Sidebar from "../Chat/SideBar";
import ChatWindow from "../Chat/ChatWindow";

const ChatBox = ({ senderId, receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [details,setDetails] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState([])

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchMessages();
  }, [receiver]);

  useEffect(() => {
    const storedSenderId = localStorage.getItem("selectedSenderId");
    if (storedSenderId) {
      setActiveUser(storedSenderId);
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
  const handleUserDetails = async(e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const response = await fetch(`${backendUrl}/details`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderId,
        })
      })
      if (response.ok){
        const responseData = await response.json()
        setDetails(responseData)
      }
      else{
        const errorMessage = await response.json()
        setError(errorMessage)
      }
    }
    catch (error){
      setError("An error occurred please try again later")
    }
    setLoading(false)
  }

  return (
    <div className="flex h-full">
      <Sidebar
        contacts={Object.keys(groupedMessages).map((senderId) => ({
          name: `Sender ${senderId}`,
          status: "Online",
          message: groupedMessages[senderId][0].content,
          image: "default-avatar.png",
        }))}
        setActiveUser={setActiveUser}
      />
      <ChatWindow
        activeUser={activeUser}
        messages={activeUser ? groupedMessages[activeUser] : []}
        sendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatBox;

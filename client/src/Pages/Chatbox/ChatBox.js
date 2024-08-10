// import React, { useState, useEffect } from "react";
// import Sidebar from "../Chat/SideBar";
// import ChatWindow from "../Chat/ChatWindow";

// const ChatBox = ({ senderId, receiver, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [groupedMessages, setGroupedMessages] = useState({});
//   const [activeUser, setActiveUser] = useState(null);
//   const [details, setDetails] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const backendUrl = process.env.REACT_APP_BACKEND_URL;

//   useEffect(() => {
//     if (receiver && receiver.id) {
//       fetchMessages(receiver.id);
//     }
//   }, [receiver]);

//   useEffect(() => {
//     const storedSenderId = localStorage.getItem("selectedSenderId");
//     if (storedSenderId) {
//       setActiveUser(storedSenderId);
//       fetchUserDetails([storedSenderId]); // Fetch details for the stored sender ID
//     }
//   }, []);

//   const fetchMessages = async (receiverId) => {
//     try {
//       const response = await fetch(`${backendUrl}/get_messages/${receiverId}`);
//       if (response.ok) {
//         const responseData = await response.json();
//         console.log("Messages fetched: ", responseData); // Debugging
//         setMessages(responseData);
//         const userIds = extractUserIds(responseData);
//         console.log("User IDs extracted: ", userIds); // Debugging
//         fetchUserDetails(userIds);
//         groupMessagesBySender(responseData);
//       } else {
//         throw new Error("Network response was not ok");
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const extractUserIds = (messages) => {
//     const userIds = new Set();
//     messages.forEach((msg) => {
//       userIds.add(msg.sender_id);
//       userIds.add(msg.receiver_id);
//     });
//     return Array.from(userIds);
//   };

//   const fetchUserDetails = async (userIds) => {
//     setLoading(true);
//     try {
//       const requests = userIds.map((userId) =>
//         fetch(`${backendUrl}/details/${userId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         })
//       );

//       const responses = await Promise.all(requests);

//       const detailsData = await Promise.all(responses.map((response) => {
//         if (response.ok) return response.json();
//         return null;
//       }));

//       const newDetails = detailsData.reduce((acc, detail, index) => {
//         if (detail) acc[userIds[index]] = detail;
//         return acc;
//       }, {});

//       console.log("User details fetched: ", newDetails); // Debugging
//       setDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
//     } catch (error) {
//       setError("An error occurred, please try again later");
//     }
//     setLoading(false);
//   };

//   const groupMessagesBySender = (messages) => {
//     const grouped = messages.reduce((acc, msg) => {
//       if (!acc[msg.sender_id]) {
//         acc[msg.sender_id] = [];
//       }
//       acc[msg.sender_id].push(msg);
//       return acc;
//     }, {});
//     setGroupedMessages(grouped);
//   };

//   const handleSendMessage = async (messageContent) => {
//     try {
//       const response = await fetch(`${backendUrl}/send_message`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sender_id: senderId,
//           receiver_id: receiver.id,
//           content: messageContent,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       fetchMessages(receiver.id);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="flex h-full">
//       <Sidebar
//         contacts={Object.keys(groupedMessages).map((senderId) => ({
//           name: details[senderId] ? `${details[senderId].first_name} ${details[senderId].last_name}` : "Unknown User",
//           status: "Online",
//           message: groupedMessages[senderId][0].content,
//           image: details[senderId] ? <img src={details[senderId].image} alt="User Avatar" /> : null,
//         }))}
//         setActiveUser={setActiveUser}
//       />
//       <ChatWindow
//         activeUser={activeUser}
//         messages={activeUser ? groupedMessages[activeUser] : []}
//         sendMessage={handleSendMessage}
//       />
//       {error && <p className="text-red-500">{error}</p>}
//       {loading && <p>Loading...</p>}
//     </div>
//   );
// };

// export default ChatBox;

import React, { useState, useEffect } from "react";
import Sidebar from "../Chat/SideBar";
import ChatWindow from "../Chat/ChatWindow";

const ChatBox = ({ senderId, receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser.id);
    }
  }, [activeUser]);

  useEffect(() => {
    const storedSenderId = localStorage.getItem("selectedSenderId");
    if (storedSenderId) {
      setActiveUser(storedSenderId);
      fetchUserDetails([storedSenderId]);
    }
  }, []);

  const fetchMessages = async (senderId,receiverId) => {
    try {
      const response = await fetch(`${backendUrl}/get_messages_between/${senderId}/${receiverId}`);
      if (response.ok) {
        const responseData = await response.json();
        console.log("Messages fetched: ", responseData);
        setMessages(responseData);
        localStorage.setItem("senders_id", responseData.sender_id);
        console.log("I Doe, My Id is",responseData.sender_id)
        const userIds = extractUserIds(responseData);
        console.log("User IDs extracted: ", userIds);
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
  
      fetchMessages(senderId, receiverId);  // Fetch updated messages after sending
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
        sendMessage={handleSendMessage}
      />
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ChatBox;

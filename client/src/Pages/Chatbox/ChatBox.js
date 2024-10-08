import React, { useState, useEffect, useCallback } from "react";
import ChatWindow from "../Chat/ChatWindow";
import './Chatbox.css'

const ChatBox = ({ senderId, receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const sedId = Number(senderId);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarMinimized(true); // Minimize sidebar on small screens
      } else {
        setIsSidebarMinimized(false); // Expand sidebar on larger screens
      }
    };

    // Check screen size on initial load
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Move fetchUserDetails above fetchMessages
  const fetchUserDetails = useCallback(async (userIds) => {
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
  }, [backendUrl]);

  const fetchMessages = useCallback(async (sedId, receiverId) => {
    if (!sedId || !receiverId) {
      console.error("Missing sedId or receiverId");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/get_messages_between/${sedId}/${receiverId}`);
      if (response.ok) {
        const responseData = await response.json();
        setMessages(responseData);
        const userIds = extractUserIds(responseData);
        fetchUserDetails(userIds); // Now fetchUserDetails is defined above
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [backendUrl, fetchUserDetails]);

  useEffect(() => {
    if (receiver) {
      fetchMessages(sedId, receiver.id);
    }
  }, [receiver, sedId, fetchMessages]);

  const extractUserIds = (messages) => {
    const userIds = new Set();
    messages.forEach((msg) => {
      userIds.add(msg.sender_id);
      userIds.add(msg.receiver_id);
    });
    return Array.from(userIds);
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
          sender_id: sedId,
          receiver_id: receiverId,
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchMessages(sedId, receiverId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="chat flex h-full">
      <ChatWindow
        activeUser={receiver}
        detailss={activeUser}
        messages={sortedMessages}
        sendMessage={handleSendMessage}
        receiver={receiver}
        onClose={onClose}
        className={isSidebarMinimized ? "mini-recents" : "recents"}
      />
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ChatBox;

// import React, { useState, useEffect, useCallback } from "react";
// import ChatWindow from "../Chat/ChatWindow";
// import "./Chatbox.css";

// const ChatBox = ({ senderId, receiver, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [details, setDetails] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeUser, setActiveUser] = useState(null);

//   const backendUrl = process.env.REACT_APP_BACKEND_URL;
//   const sedId = Number(senderId);

//   // Move fetchUserDetails above fetchMessages
//   const fetchUserDetails = useCallback(
//     async (userIds) => {
//       setLoading(true);
//       try {
//         const requests = userIds.map((userId) =>
//           fetch(`${backendUrl}/details/${userId}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           })
//         );

//         const responses = await Promise.all(requests);

//         const detailsData = await Promise.all(
//           responses.map((response) => {
//             if (response.ok) return response.json();
//             return null;
//           })
//         );

//         const newDetails = detailsData.reduce((acc, detail, index) => {
//           if (detail) acc[userIds[index]] = detail;
//           return acc;
//         }, {});

//         setDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
//       } catch (error) {
//         setError("An error occurred, please try again later");
//       }
//       setLoading(false);
//     },
//     [backendUrl]
//   );

//   const fetchMessages = useCallback(
//     async (sedId, receiverId) => {
//       if (!sedId || !receiverId) {
//         console.error("Missing sedId or receiverId");
//         return;
//       }
//       try {
//         const response = await fetch(
//           `${backendUrl}/get_messages_between/${sedId}/${receiverId}`
//         );
//         if (response.ok) {
//           const responseData = await response.json();
//           const formattedMessages = responseData.map((message) => {
//             return {
//               ...message,
//               content: message.content,
//               files: message.files || [], // Display any attached files
//             };
//           });
//           setMessages(formattedMessages);
//           console.log('messages fetched :',formattedMessages)
//           const userIds = extractUserIds(responseData);
//           fetchUserDetails(userIds); // Now fetchUserDetails is defined above
//         } else {
//           throw new Error("Network response was not ok");
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     },
//     [backendUrl, fetchUserDetails]
//   );

//   useEffect(() => {
//     if (receiver) {
//       fetchMessages(sedId, receiver.id);
//     }
//   }, [receiver, sedId, fetchMessages]);

//   const extractUserIds = (messages) => {
//     const userIds = new Set();
//     messages.forEach((msg) => {
//       userIds.add(msg.sender_id);
//       userIds.add(msg.receiver_id);
//     });
//     return Array.from(userIds);
//   };

//   const handleSendMessage = async (messageContent) => {
//     const receiverId = receiver
//       ? receiver.id
//       : localStorage.getItem("senders_id");

//     if (!receiverId) {
//       console.error("Receiver ID is missing");
//       return;
//     }

//     try {
//       const response = await fetch(`${backendUrl}/send_message`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sender_id: sedId,
//           receiver_id: receiverId,
//           content: messageContent,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       fetchMessages(sedId, receiverId);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const sortedMessages = [...messages].sort(
//     (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
//   );

//   return (
//     <div className="chat flex h-full">
//       <ChatWindow
//         activeUser={receiver}
//         detailss={activeUser}
//         messages={sortedMessages}
//         sendMessage={handleSendMessage}
//         receiver={receiver}
//         onClose={onClose}
//       />
//       {error && <p className="text-red-500">{error}</p>}
//       {loading && <p>Loading...</p>}
//     </div>
//   );
// };

// export default ChatBox;

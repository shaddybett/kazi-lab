// import React, { useEffect, useRef } from "react";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import { IoMdChatbubbles, IoMdArrowBack } from "react-icons/io"; // Icons for chat and back arrow
// import { Avatar } from "flowbite-react";
// import './Chat.css';

// const ChatWindow = ({ activeUser, messages, sendMessage, receiver, setActiveUser,minimize }) => {
//   const chatRef = useRef(null);

//   useEffect(() => {
//     // Close chat on outside click
//     const handleClickOutside = (event) => {
//       if (chatRef.current && !chatRef.current.contains(event.target)) {
//         setActiveUser(null); // Call the onClose function when clicked outside the chat window
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   if (!activeUser) {
//     return (
//       <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
//         <IoMdChatbubbles className="text-white text-6xl mr-4" />
//         <h2 className="text-white text-xl">Select a user to start chatting</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-overlay flex items-center justify-center">
//       <div
//         className="chat-window-container bg-gray-900 p-4 flex flex-col justify-between"
//         ref={chatRef}
//       >
//         {/* Back arrow for mobile */}
//         <div className="chat-header flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <IoMdArrowBack
//               className="text-white text-3xl cursor-pointer lg:hidden"
//               onClick={() => setActiveUser(null)}
//             />
//             <Avatar
//               img={activeUser.image}
//               rounded
//               alt={activeUser.name}
//               className="w-12 h-12 rounded-full mr-3 ml-2"
//             />
//             <div className="flex">
//               <p className="text-white">
//                 {activeUser.name || `${receiver.first_name} ${receiver.last_name}`}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 overflow-y-auto mb-4">
//           {messages &&
//             messages.map((message, index) => (
//               <MessageBubble key={index} message={message} senderId={activeUser.id} />
//             ))}
//         </div>

//         {/* Message Input */}
//         <MessageInput sendMessage={sendMessage} />
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;

import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles, IoMdArrowBack } from "react-icons/io"; // Icons for chat and back arrow
import { Avatar } from "flowbite-react";
import './Chat.css';

const ChatWindow = ({ activeUser, messages, sendMessage, receiver, setActiveUser, minimize, onClose, onDelete, className }) => {
  const chatRef = useRef(null);

  useEffect(() => {
    // Close chat on outside click for minimized mode
    const handleClickOutside = (event) => {
      if (minimize && chatRef.current && !chatRef.current.contains(event.target)) {
        setActiveUser(null); // Call onClose function to close the chat
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [minimize]);

  if (!activeUser) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  // If minimized is true, display the chat as a popup window (like NewChatWindow)
  if (minimize) {
    return (
      <div className="chat-overlay flex items-center justify-center">
        <div
          className="chat-window-container bg-gray-900 p-4 flex flex-col justify-between"
          ref={chatRef}
        >
          {/* Back arrow for mobile */}
          <div className="chat-header flex items-center justify-between mb-4">
            <div className="flex items-center">
              <IoMdArrowBack
                className="text-white text-3xl cursor-pointer lg:hidden"
                onClick={() => setActiveUser(null)}
              />
              <Avatar
                img={activeUser.image || ''}
                rounded
                alt={activeUser.name || 'User Avatar'}
                className="w-12 h-12 rounded-full mr-3 ml-2"
              />
              <div className="flex">
                <p className="text-white">
                  {activeUser.name || `${receiver.first_name} ${receiver.last_name}`}
                </p>
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
      </div>
    );
  }
  // When minimize is false, display the chat next to the sidebar
  return (
    <div
      className={`flex-grow bg-gray-900 p-4 flex flex-col justify-between ${className} `}
      ref={chatRef}
    >
      {/* Back arrow for mobile */}
      <div className="flex items-center justify-between mb-4 bg-gray-600 rounded-sm ">
        <div className="flex items-center">
          <IoMdArrowBack
            className="text-white text-3xl cursor-pointer lg:hidden"
            onClick={() => setActiveUser(null)}
          />
          <Avatar
            img={activeUser.image || ''}
            rounded
            alt={activeUser.name || 'User Avatar'}
            className="w-12 ml-2 h-12 rounded-full mr-3"
          />
          <div>
            <p className="text-white">
              {activeUser.name || `${receiver.first_name} ${receiver.last_name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages &&
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} senderId={activeUser.id} minimize={minimize} onDelete={onDelete} />
          ))}
      </div>

      {/* Message Input */}
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;

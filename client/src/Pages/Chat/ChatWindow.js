
import React, { useState } from "react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { IoMdChatbubbles } from "react-icons/io";

const ChatWindow = ({ activeUser, messages, sendMessage }) => {

  if (!activeUser) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-900 p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={activeUser.image || "default-avatar.png"}
            alt={activeUser.name}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <p className="text-white">{activeUser.name} </p>
            <p className="text-gray-400 text-sm">Online</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages && messages.map((message, index) => (
          <MessageBubble key={index} message={message} senderId={activeUser.id} />
        ))}
      </div>
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;



// import React from "react";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import { IoMdChatbubbles } from "react-icons/io";

// const ChatWindow = ({ activeUser, messages, sendMessage, currentUserId }) => {
//   if (!activeUser) {
//     return (
//       <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
//         <IoMdChatbubbles className="text-white text-6xl mr-4" />
//         <h2 className="text-white text-xl">Select a user to start chatting</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-grow bg-gray-900 p-4 flex flex-col justify-between">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center">
//           <img
//             src={activeUser.image || "default-avatar.png"}
//             alt={activeUser.name}
//             className="w-12 h-12 rounded-full mr-3"
//           />
//           <div>
//             <p className="text-white">{activeUser.name}</p>
//             <p className="text-gray-400 text-sm">Online</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto mb-4">
//         {messages && messages.map((message, index) => (
//           <MessageBubble key={index} message={message} currentUserId={currentUserId} />
//         ))}
//       </div>
//       <MessageInput sendMessage={sendMessage} />
//     </div>
//   );
// };

// export default ChatWindow;

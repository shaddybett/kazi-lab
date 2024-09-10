// import React, { useEffect, useRef } from "react";
// import MessageInput from "./MessageInput";
// import MessageBubble from "./MessageBubble";
// import { IoMdChatbubbles } from "react-icons/io";
// import { IoMdArrowBack } from "react-icons/io"; // Back arrow for mobile
// import "./Chat.css";

// const ChatWindow = ({
//   activeUser,
//   messages,
//   sendMessage,
//   detailss,
//   receiver,
//   setActiveUser,
//   onClose,
//   files
// }) => {
//   const chatRef = useRef(null);

//   useEffect(() => {
//     // Close chat on outside click
//     const handleClickOutside = (event) => {
//       if (chatRef.current && !chatRef.current.contains(event.target)) {
//         onClose(true); 
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [setActiveUser,onClose]);

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
//         className="chat-window-container wind bg-gray-900 p-4 flex flex-col justify-between"
//         ref={chatRef}
//       >
//         {/* Back arrow for mobile */}
//         <div className=" chatnav flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <IoMdArrowBack
//               className="text-white text-3xl cursor-pointer lg:hidden"
//               onClick={() => onClose(true)}
//             />
//             <img
//               src={activeUser.image || receiver.image}
//               alt={activeUser.name}
//               className="w-12 h-12 rounded-full mr-3"
//             />
//             <div className="flex">
//               <p className="text-white">
//                 {activeUser.name ||
//                   `${receiver.first_name} ${receiver.last_name}`}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 overflow-y-auto mb-4">
//           {messages &&
//             messages.map((message, index) => (
//               <MessageBubble
//                 key={index}
//                 message={message}
//                 senderId={activeUser.id}
//               />
//             ))}
//             {files && files.map((file,index)=>(
//               <div>{files}</div>
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
import { IoMdChatbubbles, IoMdArrowBack } from "react-icons/io";
import "./Chat.css";

const ChatWindow = ({
  activeUser,
  messages,
  sendMessage,
  receiver,
  onClose,
}) => {
  const chatRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        onClose(true); // Close chat on outside click
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!activeUser) {
    return (
      <div className="flex-grow bg-gray-900 p-4 flex items-center justify-center">
        <IoMdChatbubbles className="text-white text-6xl mr-4" />
        <h2 className="text-white text-xl">Select a user to start chatting</h2>
      </div>
    );
  }

  return (
    <div className="chat-overlay flex items-center justify-center">
      <div
        className="chat-window-container wind bg-gray-900 p-4 flex flex-col justify-between"
        ref={chatRef}
      >
        {/* Back arrow for mobile */}
        <div className="chatnav flex items-center justify-between mb-4">
          <div className="flex items-center">
            <IoMdArrowBack
              className="text-white text-3xl cursor-pointer lg:hidden"
              onClick={() => onClose(true)}
            />
            <img
              src={activeUser.image || receiver.image}
              alt={activeUser.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex">
              <p className="text-white">
                {activeUser.name ||
                  `${receiver.first_name} ${receiver.last_name}`}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4">
          {messages &&
            messages.map((message, index) => (
              <div key={index} className="mb-4">
                {/* Display message content */}
                <MessageBubble message={message.content} senderId={activeUser.id} />

                {/* Render attached files (photos, videos) */}
                {message.files && message.files.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {message.files.map((file, fileIndex) => (
                      <div key={fileIndex}>
                        {file.type === "photo" && (
                          <img
                            src={file.url}
                            alt="Attachment"
                            className="w-40 h-40 object-cover rounded-lg"
                          />
                        )}
                        {file.type === "video" && (
                          <video
                            controls
                            className="w-40 h-40 object-cover rounded-lg"
                          >
                            <source src={file.url} type="video/mp4" />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Message Input */}
        <MessageInput sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;

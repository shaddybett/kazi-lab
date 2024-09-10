// import React from "react";
// import classNames from "classnames";
// import "./Chat.css"

// const MessageBubble = ({ message, senderId }) => {
//   const isSentByAdmin = message.sender_id === senderId;

// const bubbleClass = classNames(
//   "p-3 mb-2 rounded-lg max-w-xs break-words",
//   {
//     "bg-blue-500 text-white self-end": !isSentByAdmin,
//     "bg-gray-700 text-white self-start": isSentByAdmin,
//   },
//   {
//     "ml-auto": !isSentByAdmin,
//     "mr-auto": isSentByAdmin,
//   }
// );

//   return (
//     <div className={bubbleClass}>
//       <p className="whitespace-pre-wrap">{message.content}</p>
//     </div>
//   );
// };

// export default MessageBubble;

import React from "react";
import classNames from "classnames";
import "./Chat.css";

const MessageBubble = ({ message, senderId }) => {
  const { text, files } = message;
  const isSentByAdmin = message.sender_id === senderId;

  const bubbleClass = classNames(
    "p-3 mb-2 rounded-lg max-w-xs break-words",
    {
      "bg-blue-500 text-white self-end": !isSentByAdmin,
      "bg-gray-700 text-white self-start": isSentByAdmin,
    },
    {
      "ml-auto": !isSentByAdmin,
      "mr-auto": isSentByAdmin,
    }
  );

  return (
    <div className={bubbleClass}>
      {text && <p className="text-white">{text}</p>}

      {/* Render any attached files */}
      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2">
          {files.map((file, index) => (
            <div key={index}>
              {file.type === "photo" && (
                <img
                  src={file.url}
                  alt="Attachment"
                  className="w-40 h-40 object-cover rounded-lg"
                />
              )}
              {file.type === "video" && (
                <video controls className="w-40 h-40 object-cover rounded-lg">
                  <source src={file.url} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

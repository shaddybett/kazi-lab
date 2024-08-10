import React from "react";
import classNames from "classnames";
import "./Chat.css"

const MessageBubble = ({ message, senderId }) => {
  // Determine if the message was sent by the admin (senderId) or received
  const isSentByAdmin = message.sender_id === senderId;

  // Conditionally apply classes based on who sent the message
  const bubbleClass = classNames(
    "p-3 mb-2 rounded-lg max-w-xs break-words",
    {
      "bg-blue-500 text-white self-end": isSentByAdmin, // Sent by admin
      "bg-gray-700 text-white self-start": !isSentByAdmin, // Received
    },
    {
      "ml-auto": isSentByAdmin, // Align to the right
      "mr-auto": !isSentByAdmin, // Align to the left
    }
  );

  return (
    <div className={bubbleClass}>
      <p className="whitespace-pre-wrap">{message.content}</p>
    </div>
  );
};

export default MessageBubble;

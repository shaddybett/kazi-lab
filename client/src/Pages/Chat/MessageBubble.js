import React from "react";
import classNames from "classnames";
import "./Chat.css"

const MessageBubble = ({ message, senderId }) => {
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
      <p className="whitespace-pre-wrap">{message.content}</p>
    </div>
  );
};

export default MessageBubble;

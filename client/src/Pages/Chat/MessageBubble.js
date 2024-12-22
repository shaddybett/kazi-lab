import React, { useState } from "react";
import classNames from "classnames";
import "./Chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const MessageBubble = ({ message, senderId, onDelete }) => {
  const isSentByAdmin = message.sender_id === senderId;
  const [showDelete, setShowDelete] = useState(false);

  const bubbleClass = classNames(
    "bubble",
    {
      "bubble-sender": isSentByAdmin,
      "bubble-receiver": !isSentByAdmin,
    },
    {
      "ml-auto": !isSentByAdmin,
      "mr-auto": isSentByAdmin,
    }
  );

  const handleDelete = async () => {
      onDelete(message.id);
  };

  return (
    <div className={bubbleClass} onClick={() => setShowDelete(!showDelete)}>
      <p className="" >{message.content}</p>
      {showDelete && (
          <FontAwesomeIcon icon={faTrash} onClick={handleDelete}  className="text-red-600 "  />
      )}
    </div>
  );
};

export default MessageBubble;



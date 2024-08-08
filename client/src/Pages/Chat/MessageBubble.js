// import React from "react";
// import classNames from "classnames";

// const MessageBubble = ({ message }) => {
//   const bubbleClass = classNames(
//     "p-3 mb-2 rounded-lg max-w-xs break-words",
//     {
//       "bg-blue-500 text-white self-end": message.position === "right",
//       "bg-gray-700 text-white self-start": message.position === "left",
//     },
//     {
//       "ml-auto": message.position === "right",
//       "mr-auto": message.position === "left",
//     }
//   );

//   const renderMessageContent = () => {
//     if (message.content.startsWith("[Image:")) {
//       return (
//         <>
//           {message.position === "left" && (
//             <p className="text-sm mb-2">Bot replying:</p>
//           )}
//           <img
//             src={message.content.slice(7, -1)}
//             alt="Sent"
//             className="max-w-full h-auto rounded"
//           />
//         </>
//       );
//     } else if (message.content.startsWith("[Voice message:")) {
//       return (
//         <audio
//           controls
//           src={message.content.slice(14, -1)}
//           className="w-full mt-2"
//         >
//           Your browser does not support the audio element.
//         </audio>
//       );
//     } else {
//       return <p className="whitespace-pre-wrap">{message.content}</p>;
//     }
//   };

//   return <div className={bubbleClass}>{renderMessageContent()}</div>;
// };

// export default MessageBubble;

import React from "react";
import classNames from "classnames";

const MessageBubble = ({ message, senderId }) => {
  const bubbleClass = classNames(
    "p-3 mb-2 rounded-lg max-w-xs break-words",
    {
      "bg-blue-500 text-white self-end": message.sender_id === senderId,
      "bg-gray-700 text-white self-start": message.sender_id !== senderId,
    },
    {
      "ml-auto": message.sender_id === senderId,
      "mr-auto": message.sender_id !== senderId,
    }
  );

  const renderMessageContent = () => {
    if (message.content.startsWith("[Image:")) {
      return (
        <>
          {message.sender_id !== senderId && (
            <p className="text-sm mb-2">Bot replying:</p>
          )}
          <img
            src={message.content.slice(7, -1)}
            alt="Sent"
            className="max-w-full h-auto rounded"
          />
        </>
      );
    } else if (message.content.startsWith("[Voice message:")) {
      return (
        <audio
          controls
          src={message.content.slice(14, -1)}
          className="w-full mt-2"
        >
          Your browser does not support the audio element.
        </audio>
      );
    } else {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return <div className={bubbleClass}>{renderMessageContent()}</div>;
};

export default MessageBubble;

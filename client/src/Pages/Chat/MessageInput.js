// import React, { useState, useRef, useEffect } from "react";
// import { FaPaperclip, FaMicrophone, FaSmile, FaTimes } from "react-icons/fa";

// const MessageInput = ({ sendMessage }) => {
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showEmojiOptions, setShowEmojiOptions] = useState(false);
//   const fileInputRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);
  

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (showEmojiOptions && !event.target.closest(".emoji-picker")) {
//         setShowEmojiOptions(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showEmojiOptions]);

//   const handleSendMessage = () => {
//     if (newMessage.trim() || selectedImage) {
//       const messageContent = selectedImage
//         ? `[Image: ${selectedImage.previewUrl}]`
//         : newMessage.trim();
//       sendMessage(messageContent);
//       setNewMessage("");
//       setSelectedImage(null);
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setSelectedImage({
//           file: file,
//           previewUrl: reader.result,
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleVoiceMessage = async () => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//         });

//         mediaRecorderRef.current = new MediaRecorder(stream);
//         chunksRef.current = [];

//         mediaRecorderRef.current.ondataavailable = (event) => {
//           chunksRef.current.push(event.data);
//         };

//         mediaRecorderRef.current.onstop = () => {
//           const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
//           const audioUrl = URL.createObjectURL(audioBlob);
//           sendMessage(`[Voice message: ${audioUrl}]`);
//         };

//         mediaRecorderRef.current.start();

//         setTimeout(() => {
//           mediaRecorderRef.current.stop();
//         }, 3000); // Record for 3 seconds
//       } catch (err) {
//         console.error("Error accessing audio devices.", err);
//       }
//     } else {
//       console.error("getUserMedia not supported on your browser!");
//     }
//   };

//   const handleEmojiClick = (emoji) => {
//     setNewMessage(newMessage + emoji);
//   };

//   const toggleEmojiPicker = () => {
//     setShowEmojiOptions(!showEmojiOptions);
//   };

//   const removeSelectedImage = () => {
//     setSelectedImage(null);
//   };

//   return (
//     <div className="flex flex-col bg-gray-800 p-3 rounded-lg">
//       {selectedImage && (
//         <div className="relative mb-2">
//           <img
//             src={selectedImage.previewUrl}
//             alt="Selected"
//             className="w-24 h-24 rounded mr-2 cursor-pointer"
//           />
//           <FaTimes
//             className="text-white absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
//             onClick={removeSelectedImage}
//           />
//         </div>
//       )}
//       <div className="flex items-center relative">
//         <FaSmile
//           className="text-white mr-4 cursor-pointer"
//           onClick={toggleEmojiPicker}
//         />
//         {showEmojiOptions && (
//           <div className="absolute bottom-full left-0 bg-gray-700 p-2 rounded z-10 emoji-picker">
//             <div className="flex flex-wrap">
//               {["😊", "😂", "👍", "❤️", "🎉", "😍", "😎", "🙌", "🥳", "🔥"].map(
//                 (emoji) => (
//                   <span
//                     key={emoji}
//                     className="cursor-pointer text-white text-2xl mr-2 mb-2"
//                     onClick={() => handleEmojiClick(emoji)}
//                   >
//                     {emoji}
//                   </span>
//                 )
//               )}
//               {["🇰🇪", "🇹🇿", "🇺🇬", "🇷🇼"].map((emoji) => (
//                 <span
//                   key={emoji}
//                   className="cursor-pointer text-white text-2xl mr-2 mb-2"
//                   onClick={() => handleEmojiClick(emoji)}
//                 >
//                   {emoji}
//                 </span>
//               ))}
//               {["🌾", "🚜", "🌱", "🍅", "🌽"].map((emoji) => (
//                 <span
//                   key={emoji}
//                   className="cursor-pointer text-white text-2xl mr-2 mb-2"
//                   onClick={() => handleEmojiClick(emoji)}
//                 >
//                   {emoji}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
//         <textarea
//           placeholder="Type a message"
//           className="bg-gray-800 text-white flex-1 outline-none resize-none border border-gray-600 p-2 rounded"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               handleSendMessage();
//             } else if (e.key === "Enter" && e.shiftKey) {
//               setNewMessage(newMessage + "\n");
//             }
//           }}
//         />
//         <FaPaperclip
//           className="text-white mx-4 cursor-pointer"
//           onClick={() => fileInputRef.current.click()}
//         />
//         <input
//           type="file"
//           ref={fileInputRef}
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//         />
//         <FaMicrophone
//           className="text-white cursor-pointer ml-auto"
//           onClick={handleVoiceMessage}
//         />
//         <button onClick={handleSendMessage} className="text-white ml-4">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageInput;

import React, { useState, useRef, useEffect } from "react";
import { FaPaperclip, FaMicrophone, FaSmile, FaTimes } from "react-icons/fa";

const MessageInput = ({ sendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // Handles multiple files
  const [showEmojiOptions, setShowEmojiOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiOptions && !event.target.closest(".emoji-picker")) {
        setShowEmojiOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiOptions]);

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files); // Handle multiple files
    setSelectedFiles((prevFiles) => [...prevFiles, ...selected]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return; // No files to upload

    setLoading(true);
    const formData = new FormData();
    const token = localStorage.getItem("token");

    selectedFiles.forEach((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (["png", "jpg", "jpeg", "webp"].includes(fileExtension)) {
        formData.append("photos", file);
      } else {
        formData.append("videos", file);
      }
    });

    try {
      const response = await fetch(`/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        const fileUrls = [...responseData.photos, ...responseData.videos];

        return fileUrls; // Return file URLs for message content
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading files", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return; // No content to send

    const uploadedFiles = await handleUpload(); // Upload the files first

    const messageContent = {
      text: newMessage.trim(),
      files: uploadedFiles || [], // Send the uploaded file URLs if available
    };

    sendMessage(messageContent); // Send the message with the files

    // Reset the state
    setNewMessage("");
    setSelectedFiles([]);
  };

  const handleVoiceMessage = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          chunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          sendMessage({ text: "", files: [audioUrl] }); // Send voice message as a file URL
        };

        mediaRecorderRef.current.start();
        setTimeout(() => mediaRecorderRef.current.stop(), 3000); // Record for 3 seconds
      } catch (err) {
        console.error("Error accessing audio devices.", err);
      }
    } else {
      console.error("getUserMedia not supported on your browser!");
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(newMessage + emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiOptions(!showEmojiOptions);
  };

  const removeSelectedFile = (fileToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  return (
    <div className="flex flex-col bg-gray-800 p-3 rounded-lg">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap mb-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative mr-2 mb-2">
              {file.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Selected"
                  className="w-24 h-24 rounded cursor-pointer"
                />
              )}
              {file.type.startsWith("video/") && (
                <video
                  className="w-24 h-24 rounded cursor-pointer"
                  controls
                  src={URL.createObjectURL(file)}
                />
              )}
              <FaTimes
                className="text-white absolute top-0 right-0 cursor-pointer"
                onClick={() => removeSelectedFile(file)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center relative">
        <FaSmile className="text-white mr-4 cursor-pointer" onClick={toggleEmojiPicker} />
        {showEmojiOptions && (
          <div className="absolute bottom-full left-0 bg-gray-700 p-2 rounded z-10 emoji-picker">
            <div className="flex flex-wrap">
              {["😊", "😂", "👍", "❤️", "🎉", "😍", "😎", "🙌", "🥳", "🔥"].map((emoji) => (
                <span
                  key={emoji}
                  className="cursor-pointer text-white text-2xl mr-2 mb-2"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}

        <textarea
          placeholder="Type a message"
          className="bg-gray-800 text-white flex-1 outline-none resize-none border border-gray-600 p-2 rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            } else if (e.key === "Enter" && e.shiftKey) {
              setNewMessage(newMessage + "\n");
            }
          }}
        />

        <FaPaperclip className="text-white mx-4 cursor-pointer" onClick={() => fileInputRef.current.click()} />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />

        <FaMicrophone className="text-white cursor-pointer ml-auto" onClick={handleVoiceMessage} />
        <button onClick={handleSendMessage} className="text-white ml-4">
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;


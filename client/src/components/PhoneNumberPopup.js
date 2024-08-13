import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { Button, Label, TextInput } from "flowbite-react";
import thumb from "../assets/thumb.png";
import down from "../assets/down.png";
import chat from "../assets/chat.png";
import ChatBox from "../Pages/Chatbox/ChatBox";

function PhoneNumberPopup({ phoneNumber, onClose }) {
  const popupRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [chatUser,setChatUser] = useState(null)

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const name = localStorage.getItem("namme");
  const idd = localStorage.getItem("idid"); // idd stands for the user's id
  const currentUserId = localStorage.getItem("id")
  const userJson = localStorage.getItem("user")
  const [messageContent, setMessageContent] = useState("");

  const handleInputChange = (e) => {
    setMessageContent(e.target.value);
  };
  const user = userJson ? JSON.parse(userJson) : null;

  const handleChatClick = ()=>{
    if (user) {
      setChatUser(user);
    }else {
      console.error("No user found in local storage")
    }
  }
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const unLikeJob = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${backendUrl}/unlike_job/${idd}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess("unLike added ");
    } catch (error) {
      setError("Error unliking job");
      console.error("Error liking job:", error);
    } finally {
      setLoading(false);
    }
  };
  const likeJob = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${backendUrl}/like_job/${idd}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess("Like added successfully");
    } catch (error) {
      setError("Error liking job");
      console.error("Error liking job:", error);
    } finally {
      setLoading(false);
    }
  };
  const onCloseChat =()=>{
    setChatUser(null)
  }
  const admins = [5];
  const handleSendMessage = async (messageContent) => {
    if (messageContent.trim() === "") {
      setError("Input field can't be empty")
      console.log("Message is empty, not sending");
      return;
    }
    try {
      const sendMessages = admins.map(async (adminId) => {
        const response = await fetch(`${backendUrl}/send_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: currentUserId,
            receiver_id: adminId, 
            content: messageContent,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      });
  
      await Promise.all(sendMessages);
  
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error sending message");
    }
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClickOutside}
    >
      <div
        ref={popupRef}
        className="bg-white rounded-lg p-6 w-full max-w-xs md:max-w-sm mx-4 md:mx-0"
        onClick={stopPropagation}
      >
        <div className="flex flex-col items-center gap-2 mt-10">
          <div className="text-center md:text-left ">
            <p className=" text-black" >
              {name} is grateful for the assignment and asks you to leave a like
              to help get more clients.
            </p>
            <p className="mt-3 text-black">
              <strong>Phone Number:</strong> {phoneNumber}{" "}
              <a href={`tel:${phoneNumber}`} className="ml-0 text-blue-500">
                <FontAwesomeIcon icon={faPhone} className="ml-5" />
              </a>
            </p>
          </div>
          <div className="flex flex-row items-center justify-start mt-3">
            <img
              src={thumb}
              alt="thumbs up"
              onClick={likeJob}
              disabled={loading}
              className="mr-16 cursor-pointer"
            />
            <img
              src={down}
              alt="thumbs down"
              onClick={unLikeJob}
              disabled={loading}
              className="mr-16 cursor-pointer"
            />
            <img
              src={chat}
              onClick={handleChatClick}
              disabled={loading}
              className="cursor-pointer"
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="input-gray"
                color="gray"
                value={`Anything you would like to tell the administration concerning ${name}?`}
              />
            </div>
            <TextInput
              id="input-gray"
              placeholder="Your text here..."
              required
              color="gray"
            />
            <Button gradientDuoTone="purpleToBlue" className="mt-4 ml-20" onClick={handleSendMessage} >
              Send
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
          {chatUser && (<ChatBox senderId={currentUserId} receiver={chatUser} onClose={onCloseChat} />)}
        </div>
      </div>
    </div>
  );
}

export default PhoneNumberPopup;

// import React, { useRef, useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPhone } from "@fortawesome/free-solid-svg-icons";
// import { Button, Label, TextInput } from "flowbite-react";
// import thumb from "../assets/thumb.png";
// import down from "../assets/down.png";
// import chat from "../assets/chat.png";
// import ChatBox from "../Pages/Chatbox/ChatBox";

// function PhoneNumberPopup({ phoneNumber, onClose }) {
//   const popupRef = useRef();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [chatUser,setChatUser] = useState(null)

//   const backendUrl = process.env.REACT_APP_BACKEND_URL;
//   const name = localStorage.getItem("namme");
//   const idd = localStorage.getItem("idid"); 
//   const currentUserId = localStorage.getItem("id")
//   const userJson = localStorage.getItem("user")
//   const [messageContent, setMessageContent] = useState("");

//   const handleInputChange = (e) => {
//     setMessageContent(e.target.value);
//   };
//   const user = userJson ? JSON.parse(userJson) : null;

//   const handleChatClick = ()=>{
//     if (user) {
//       setChatUser(user);
//     }else {
//       console.error("No user found in local storage")
//     }
//   }
//   const handleClickOutside = (event) => {
//     if (popupRef.current && !popupRef.current.contains(event.target)) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const stopPropagation = (event) => {
//     event.stopPropagation();
//   };

//   const unLikeJob = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
//     try {
//       const response = await fetch(`${backendUrl}/unlike_job/${idd}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setSuccess("unLike added ");
//     } catch (error) {
//       setError("Error unliking job");
//       console.error("Error liking job:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const likeJob = async () => {
//     setLoading(true);
//     setError(null);
//     setSuccess(null);
//     try {
//       const response = await fetch(`${backendUrl}/like_job/${idd}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setSuccess("Like added successfully");
//     } catch (error) {
//       setError("Error liking job");
//       console.error("Error liking job:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const onCloseChat =()=>{
//     setChatUser(null)
//   }
//   const admins = [7];
//   const handleSendMessage = async () => {
//     if (messageContent === "") {
//       setError("Input field can't be empty");
//       console.log("Message is empty, not sending");
//       return;
//     }
  
//     try {
//       // Debug: Check currentUserId and messageContent
//       console.log("Sending message from user:", currentUserId);
//       console.log("Message content:", messageContent);
  
//       const sendMessages = admins.map(async (adminId) => {
//         const response = await fetch(`${backendUrl}/send_message`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             sender_id: currentUserId,
//             receiver_id: adminId,
//             content: messageContent,
//           }),
//         });
  
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(
//             `Network response was not ok: ${response.statusText} - ${errorData.error}`
//           );
//         }
  
//         // Debug: Check the response status and response body
//         console.log(`Message sent to admin ${adminId} with response:`, response);
//       });
  
//       await Promise.all(sendMessages);
//       setSuccess("Message sent successfully");
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setError(`Error sending message: ${error.message}`);
//     } finally {
//       setMessageContent("");
//     }
//   };
  
  
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//       onClick={handleClickOutside}
//     >
//       <div
//         ref={popupRef}
//         className="bg-white rounded-lg p-6 w-full max-w-xs md:max-w-sm mx-4 md:mx-0"
//         onClick={stopPropagation}
//       >
//         <div className="flex flex-col items-center gap-2 mt-10">
//           <div className="text-center md:text-left ">
//             <p className=" text-black" >
//               {name} is grateful for the assignment and asks you to leave a like
//               to help get more clients.
//             </p>
//             <p className="mt-3 text-black">
//               <strong>Phone Number:</strong> {phoneNumber}{" "}
//               <a href={`tel:${phoneNumber}`} className="ml-0 text-blue-500">
//                 <FontAwesomeIcon icon={faPhone} className="ml-5" />
//               </a>
//             </p>
//           </div>
//           <div className="flex flex-row items-center justify-start mt-3">
//             <img
//               src={thumb}
//               alt="thumbs up"
//               onClick={likeJob}
//               disabled={loading}
//               className="mr-16 cursor-pointer"
//             />
//             <img
//               src={down}
//               alt="thumbs down"
//               onClick={unLikeJob}
//               disabled={loading}
//               className="mr-16 cursor-pointer"
//             />
//             <img
//               src={chat}
//               onClick={handleChatClick}
//               disabled={loading}
//               className="cursor-pointer"
//             />
//           </div>

//           <div>
//             <div className="mb-2 block">
//               <Label
//                 htmlFor="input-gray"
//                 color="gray"
//                 value={`Anything you would like to tell the administration concerning ${name}?`}
//               />
//             </div>
//             <TextInput
//               id="input-gray"
//               placeholder="Your text here..."
//               required
//               color="gray"
//               value={messageContent}  
//               onChange={handleInputChange} 
//             />
//             <Button gradientDuoTone="purpleToBlue" className="mt-4 ml-20" onClick={handleSendMessage} >
//               Send
//             </Button>
//           </div>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//           {success && <p className="text-green-500 mt-2">{success}</p>}
//           {chatUser && (<ChatBox senderId={currentUserId} receiver={chatUser} onClose={onCloseChat} />)}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PhoneNumberPopup;






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
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const name = localStorage.getItem("namme");
  const idd = localStorage.getItem("idid"); 
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

  const handlePaymentButtonClick = () => {
    setPaymentModalOpen(true);
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmitPayment = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${backendUrl}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: idd, 
          amount: 20, 
          ...cardDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess("Payment processed successfully");
      setPaymentModalOpen(false);
    } catch (error) {
      setError(`Error processing payment: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
  const admins = [7];
  const handleSendMessage = async () => {
    if (messageContent === "") {
      setError("Input field can't be empty");
      console.log("Message is empty, not sending");
      return;
    }
  
    try {
      console.log("Sending message from user:", currentUserId);
      console.log("Message content:", messageContent);
  
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
          const errorData = await response.json();
          throw new Error(
            `Network response was not ok: ${response.statusText} - ${errorData.error}`
          );
        }

        console.log(`Message sent to admin ${adminId} with response:`, response);
      });
  
      await Promise.all(sendMessages);
      setSuccess("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      setError(`Error sending message: ${error.message}`);
    } finally {
      setMessageContent("");
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
          <p className="text-black" >Click the button below to pay 20 dollars to account 24235627829</p>
          <Button onClick={handlePaymentButtonClick} className="mt-4">
            pay
          </Button>
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
          {paymentModalOpen && (
            <div className="bg-white rounded-lg p-4 w-full">
              <h2 className="text-lg font-semibold mb-4">
                Enter Your Card Details
              </h2>
              <TextInput
                name="cardNumber"
                placeholder="Card Number"
                onChange={handleCardDetailsChange}
                value={cardDetails.cardNumber}
                className="mb-2"
              />
              <TextInput
                name="cardExpiry"
                placeholder="Card Expiry (MM/YY)"
                onChange={handleCardDetailsChange}
                value={cardDetails.cardExpiry}
                className="mb-2"
              />
              <TextInput
                name="cardCVC"
                placeholder="Card CVC"
                onChange={handleCardDetailsChange}
                value={cardDetails.cardCVC}
                className="mb-4"
              />
              <Button
                gradientDuoTone="purpleToBlue"
                onClick={handleSubmitPayment}
                disabled={loading}
              >
                Submit Payment
              </Button>
            </div>
          )}
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
              value={messageContent}  
              onChange={handleInputChange} 
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


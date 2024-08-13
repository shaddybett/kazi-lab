// import React, { useState } from "react";
// import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";

// function BlockedUser(details) {
//   const [success, setSuccess] = useState(null);
//   const [error, setError] = useState(null);
//   const [messageContent, setMessageContent] = useState("");
//   const backendUrl = process.env.REACT_APP_BACKEND_URL;
//   const handleInputChange = (e) => {
//     setMessageContent(e.target.value);
//   };
//   const admins = [5];
//   const handleSendMessage = async () => {
//     if (messageContent === "") {
//       setError("Input field can't be empty");
//       console.log("Message is empty, not sending");
//       return;
//     }

//     try {
//       // Debug: Check currentUserId and messageContent
//       console.log("Sending message from user:", details.user_id);
//       console.log("Message content:", messageContent);

//       const sendMessages = admins.map(async (adminId) => {
//         const response = await fetch(`${backendUrl}/send_message`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             sender_id: details.user_id,
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

//         console.log(
//           `Message sent to admin ${adminId} with response:`,
//           response
//         );
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
//     <div>
//       <Card className="max-w-sm">
//         <form className="flex flex-col gap-4">
//           <div>
//             <p>
//               Dear {details.first_name} {details.last_name} you have been
//               blocked for {details.reason}. If you wish to appeal, kindly state
//               your case in the input field below{" "}
//             </p>
//             <div className="mb-2 block">
//               <Label htmlFor="email1" value="Your email" />
//             </div>
//             <TextInput
//               id="input-gray"
//               placeholder="Your text here..."
//               required
//               color="gray"
//               value={messageContent}
//               onChange={handleInputChange}
//             />
//           </div>
//           <Button nClick={handleSendMessage}>Submit</Button>
//         </form>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//         {success && <p className="text-green-500 mt-2">{success}</p>}
//       </Card>
//     </div>
//   );
// }

// export default BlockedUser;


import React, { useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";

function BlockedUser({ details }) {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleInputChange = (e) => {
    setMessageContent(e.target.value);
  };

  const admins = [5]; // Assuming 5 is the admin's ID
  const handleSendMessage = async () => {
    if (messageContent === "") {
      setError("Input field can't be empty");
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
            sender_id: details.user_id,
            receiver_id: adminId,
            content: messageContent,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Network response was not ok: ${response.statusText} - ${errorData.error}`);
        }
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
    <div>
      <Card className="max-w-sm">
        <form className="flex flex-col gap-4">
          <div>
            <p>
              Dear {details.first_name} {details.last_name}, you have been
              blocked for {details.reason}. If you wish to appeal, kindly state
              your case in the input field below.
            </p>
            <div className="mb-2 block">
              <Label htmlFor="message" value="Your message" />
            </div>
            <TextInput
              id="message"
              placeholder="Your text here..."
              required
              value={messageContent}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={handleSendMessage}>Submit</Button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </Card>
    </div>
  );
}

export default BlockedUser;
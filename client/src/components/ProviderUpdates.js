// import React, { useEffect, useState } from "react";
// import { Card, Dropdown } from "flowbite-react";
// import ChatBox from "../Pages/Chatbox/ChatBox";

// function ProviderUpdates({ senderId, assigned, likes }) {
//   const backendUrl = process.env.REACT_APP_BACKEND_URL;
//   const [providerIds, setProviderIds] = useState([]);
//   const [customerDetails, setCustomerDetails] = useState([]);
//   const [openChat, setOpenChat] = useState(false);
//   const [currentCustomer, setCurrentCustomer] = useState(null); // To store the customer to chat with

//   const fetchAssignedIds = async () => {
//     try {
//       const response = await fetch(
//         `${backendUrl}/assigned_resource/${senderId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setProviderIds(data.provider_ids);
//       } else {
//         console.error(data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching assigned IDs:", error);
//     }
//   };

//   const fetchCustomerDetails = async () => {
//     if (providerIds.length === 0) return;

//     try {
//       const response = await fetch(
//         `${backendUrl}/recent_clients/${providerIds.join(",")}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setCustomerDetails(data);
//       } else {
//         console.error(data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching customer details:", error);
//     }
//   };

//   const handleChatClick = (customer) => {
//     setCurrentCustomer(customer); // Set the current customer to chat with
//     setOpenChat(true); // Open the chat box
//   };

//   useEffect(() => {
//     fetchAssignedIds();
//   }, [senderId]);

//   useEffect(() => {
//     fetchCustomerDetails();
//   }, [providerIds]);

//   return (
//     <div>
//       <Card>
//         <h4 className="text-black">Recent Customers</h4>
//         {customerDetails.map((customer, index) => (
//           <div key={index} className="flex items-center justify-between mb-2 text-black ">
//             <p className="text-black" >
//               {customer.first_name} {customer.last_name}
//             </p>
//             <Dropdown inline label="Options">
//               <Dropdown.Item onClick={() => handleChatClick(customer)}>
//                 Chat
//               </Dropdown.Item>
//             </Dropdown>
//           </div>
//         ))}
//         <strong className="text-green-700 ml-4">
//           Jobs Assigned {assigned}
//         </strong>
//         <strong className="text-green-700 ml-4">Likes given {likes}</strong>
//       </Card>
//       {openChat && <ChatBox senderId={senderId} receiver={currentCustomer} />}
//     </div>
//   );
// }

// export default ProviderUpdates;

import React, { useEffect, useState, useCallback } from "react";
import { Card, Dropdown } from "flowbite-react";
import ChatBox from "../Pages/Chatbox/ChatBox";

function ProviderUpdates({ senderId, assigned, likes }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [providerIds, setProviderIds] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null); // To store the customer to chat with

  const fetchAssignedIds = useCallback(async () => {
    try {
      const response = await fetch(
        `${backendUrl}/assigned_resource/${senderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProviderIds(data.provider_ids);
        console.log("Assigned IDs fetched:", data.provider_ids);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching assigned IDs:", error);
    }
  }, [senderId, backendUrl]); // Dependencies: senderId and backendUrl

  const fetchCustomerDetails = useCallback(async () => {
    if (providerIds.length === 0) {
      console.log("No provider IDs available yet.");
      return;
    }
    const stringProviderIds = providerIds.map((id) => id.toString());

    try {
      const response = await fetch(
        `${backendUrl}/recent_clients/${stringProviderIds.join(",")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCustomerDetails(data);
        console.log("Customer details fetched:", data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [providerIds, backendUrl]); // Dependencies: providerIds and backendUrl

  const handleChatClick = (customer) => {
    setCurrentCustomer(customer); // Set the current customer to chat with
    setOpenChat(true); // Open the chat box
  };

  useEffect(() => {
    fetchAssignedIds();
  }, [fetchAssignedIds]); // Now it has a stable reference

  useEffect(() => {
    fetchCustomerDetails();
  }, [providerIds, fetchCustomerDetails]); // Now it has a stable reference

  return (
    <div>
      <Card>
        <h4 className="text-black">Recent Customers</h4>
        {customerDetails.length === 0 && (
          <p className="text-gray-500">No customers available.</p>
        )}
        {customerDetails.map((customer, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-2 text-black"
          >
            <p className="text-black">
              {customer.first_name} {customer.last_name}
            </p>
            <Dropdown inline label="Options">
              <Dropdown.Item onClick={() => handleChatClick(customer)}>
                Chat
              </Dropdown.Item>
            </Dropdown>
          </div>
        ))}
        <strong className="text-green-700 ml-4">
          Jobs Assigned {assigned}
        </strong>
        <strong className="text-green-700 ml-4">Likes given {likes}</strong>
      </Card>
      {openChat && <ChatBox senderId={senderId} receiver={currentCustomer} />}
    </div>
  );
}

export default ProviderUpdates;

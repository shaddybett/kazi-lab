
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { Card } from "flowbite-react";
// import NewChatBox from "../Pages/Chat/NewChatBox";
// import { FaCommentDots } from 'react-icons/fa'; // Import Font Awesome Icon
// import './ProviderDashboard.css';

// function ProviderUpdates({ senderId, assigned, likes, className, onClose, minimized }) {
//   const backendUrl = process.env.REACT_APP_BACKEND_URL;
//   const [providerIds, setProviderIds] = useState([]);
//   const [customerDetails, setCustomerDetails] = useState([]);
//   const [openChat, setOpenChat] = useState(false);
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
//   const [currentCustomer, setCurrentCustomer] = useState(null);

//   const chatBoxRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setIsSidebarMinimized(true);
//       } else {
//         setIsSidebarMinimized(false);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleClickOutside = (event) => {
//     if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
//       if (typeof onClose === "function") {
//         onClose();
//       }
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const fetchAssignedIds = useCallback(async () => {
//     try {
//       const response = await fetch(`${backendUrl}/assigned_resource/${senderId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setProviderIds(data.provider_ids);
//       } else {
//         console.error(data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching assigned IDs:", error);
//     }
//   }, [senderId, backendUrl]);

//   const fetchCustomerDetails = useCallback(async () => {
//     if (providerIds.length === 0) {
//       return;
//     }
//     const stringProviderIds = providerIds.map((id) => id.toString());

//     try {
//       const response = await fetch(`${backendUrl}/recent_clients?ids=${stringProviderIds.join(",")}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setCustomerDetails(data);
//       } else {
//         console.error(data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching customer details:", error);
//     }
//   }, [providerIds, backendUrl]);

//   const handleChatClick = (customer) => {
//     setCurrentCustomer(customer);
//     setOpenChat(true);
//   };

//   const handleClose = () => {
//     setOpenChat(false);
//   };

//   useEffect(() => {
//     fetchAssignedIds();
//   }, [fetchAssignedIds]);

//   useEffect(() => {
//     fetchCustomerDetails();
//   }, [providerIds, fetchCustomerDetails]);

//   return (
//     <div ref={chatBoxRef} className={`${className} provider-updates-container`}>
//       <div className={minimized ? "mini-updates" : ""}>
//         <Card className="rounded-lg shadow-lg p-6 bg-white">
//           <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Customers</h4>
//           {customerDetails.length === 0 && (
//             <p className="text-gray-500">No customers available.</p>
//           )}
//           {customerDetails.map((customer, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between  p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <p className="text-gray-700 font-medium">
//                 {customer.first_name} {customer.last_name}
//               </p>
//               <FaCommentDots
//                 className="text-blue-500 cursor-pointer hover:text-blue-700"
//                 size={20}
//                 onClick={() => handleChatClick(customer)}
//               />
//             </div>
//           ))}
//           <div className="mt-4">
//             <strong className="text-green-700 block">Jobs Assigned: {assigned}</strong>
//             <strong className="text-green-700 block">Likes Given: {likes}</strong>
//           </div>
//         </Card>
//         {openChat && <NewChatBox senderId={senderId} receiver={currentCustomer} onClose={handleClose} />}
//       </div>
//     </div>
//   );
// }

// export default ProviderUpdates;





// .delete-button {
//   position: absolute;
//   top: 5px;
//   right: 5px;
//   background-color: rgba(255, 255, 255, 0.7);
//   border: none;
//   cursor: pointer;
//   padding: 5px;
//   border-radius: 50%;
// }
// .main-page{
//   background-color: linear-gradient(to bottom, var(--top-gradient-color), var(--bottom-gradient-color));
// }
// .main-card{
//   background: linear-gradient(to bottom, var(--top-gradient-color), var(--bottom-gradient-color));
//   color: white;
// }

// .overlay {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.75);
// }
// /* CSS Example */
// .grid-item img {
// height: 200px;
// object-fit: cover; /* Ensures the image doesn't stretch */
// width: 100%;
// border-radius: 8px;
// }
// .modal {
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: white;
//   padding: 20px;
//   border-radius: 8px;
//   box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
//   z-index: 1001;
//   max-width: 90%; /* Responsive limit */
//   max-height: 90%;
//   overflow: auto; /* Allow scrolling if content is large */
// }

// /* Image inside the modal */
// .modal-image {
//   max-width: none; /* Disable width constraint */
//   max-height: none; /* Disable height constraint */
//   width: auto; /* Use original width */
//   height: auto; /* Use original height */
//   display: block;
//   margin: 0 auto; /* Center the image */
// }

// /* Video inside the modal */
// .modal-video {
//   width: 100%; /* Video should scale responsively */
//   height: auto;
// }

// /* Video container for modal */
// .modal-video-container {
//   position: relative;
//   width: 100%;
//   max-height: 90vh; /* Limit video height */
//   overflow: hidden;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
// .chatbox-popup {
//   position: fixed;
//   top: 50%;  /* Position it at the center vertically */
//   left: 50%; /* Position it at the center horizontally */
//   transform: translate(-50%, -50%); /* Adjust to make the element perfectly centered */
//   width: 60%; 
//   height: auto; 
//   background-color: white;
//   border-radius: 12px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Add shadow for a popup effect */
//   z-index: 9999; /* Ensure it's on top of other elements */
//   overflow: hidden;
// }
// .min-pop{
//   position: fixed;
//   top: 50%;  /* Position it at the center vertically */
//   left: 50%; /* Position it at the center horizontally */
//   transform: translate(-50%, -50%); /* Adjust to make the element perfectly centered */
//   width: auto; 
//   height: auto; 
//   background-color: white;
//   border-radius: 12px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Add shadow for a popup effect */
//   z-index: 9999; /* Ensure it's on top of other elements */
//   overflow: hidden;
// }

// .updates{
//   position: fixed;
//   top: 20%;  
//   width: 40%;
//   /* bottom: 50%; */
//   border-radius: 12px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Add shadow for a popup effect */

// }
// .min-updates{
//   position: fixed;
//   top: 20%;  
//   width: 80%;
//   /* bottom: 50%; */
//   border-radius: 12px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Add shadow for a popup effect */
// }
// .whole-updates{
//   position: fixed;
//   top: 50%;  /* Position it at the center vertically */
//   left: 50%; /* Position it at the center horizontally */
//   transform: translate(-50%, -50%);
//   width: 80%; 
//   height: auto; 
//   /* background-color: white; */
//   border-radius: 12px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Add shadow for a popup effect */
//   /* z-index: 9999;  */
//   overflow: hidden;
// }




import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card } from "flowbite-react";
import NewChatBox from "../Pages/Chat/NewChatBox";
import { FaCommentDots, FaHeart, FaBriefcase } from 'react-icons/fa'; // Import more icons for jobs and likes
import './ProviderDashboard.css';

function ProviderUpdates({ senderId, assigned, likes, className, onClose, minimized }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [providerIds, setProviderIds] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarMinimized(true);
      } else {
        setIsSidebarMinimized(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClickOutside = (event) => {
    if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
      if (typeof onClose === "function") {
        onClose();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAssignedIds = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/assigned_resource/${senderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProviderIds(data.provider_ids);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching assigned IDs:", error);
    }
  }, [senderId, backendUrl]);

  const fetchCustomerDetails = useCallback(async () => {
    if (providerIds.length === 0) {
      return;
    }
    const stringProviderIds = providerIds.map((id) => id.toString());

    try {
      const response = await fetch(`${backendUrl}/recent_clients?ids=${stringProviderIds.join(",")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCustomerDetails(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [providerIds, backendUrl]);

  const handleChatClick = (customer) => {
    setCurrentCustomer(customer);
    setOpenChat(true);
  };

  const handleClose = () => {
    setOpenChat(false);
  };

  useEffect(() => {
    fetchAssignedIds();
  }, [fetchAssignedIds]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [providerIds, fetchCustomerDetails]);

  return (
    <div ref={chatBoxRef} className={`provider-updates-popup `}>
      <div className={minimized ? "mini-updates" : ""}>
        <div className="rounded-lg shadow-lg p-2 bg-gradient-to-r from-blue-500 to-indigo-600">
          <h4 className="text-xl font-bold text-white mb-4 text-center">Recent Clients</h4>
          {customerDetails.length === 0 && (
            <p className="text-gray-200 text-center">No customers available.</p>
          )}
          {customerDetails.map((customer, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-3 p-2 bg-white text-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
            >
              <p className="font-medium text-blue-900 ">
                {customer.first_name} {customer.last_name}
              </p>
              <FaCommentDots
                className="text-blue-500 cursor-pointer hover:text-blue-700 transition-transform transform hover:scale-110"
                size={20}
                onClick={() => handleChatClick(customer)}
              />
            </div>
          ))}
          <h2 className=" text-white flex justify-center " >Likes received and jobs assigned</h2>
          <div className=" text-center">
            <div className="stats-box flex items-center justify-center space-x-4">
              <div className="likes-box flex items-center">
                <FaHeart className="text-red-500 mr-2 animate-pulse" size={24} />
                <strong className="text-white text-2xl font-semibold">{likes}</strong>
              </div>
              <div className="assigned-box flex items-center">
                <FaBriefcase className="text-yellow-400 mr-2" size={24} />
                <strong className="text-white text-2xl font-semibold">{assigned}</strong>
              </div>
            </div>
          </div>
        </div>
        {openChat && <NewChatBox senderId={senderId} receiver={currentCustomer} onClose={handleClose} />}
      </div>
    </div>
  );
}

export default ProviderUpdates;
